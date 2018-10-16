// @login & register
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const gravatar = require('gravatar');
const keys = require("../../config/keys");
const passport = require("passport");
const User = require("../../models/User");

// $route GET api/users/test
// @desc 返回请求的json数据
// @access public
// router.get("/test", (req, res) => {
//     res.json({msg:"login works"});
// });

// $route POST api/users/register
// @desc 返回请求的json数据
// @access public（如果返回一个token，就是一个私有接口）
router.post("/register", (req, res) => {
    // console.log(req.body);
    // 查询数据库里是否有邮箱
    User.findOne({email:req.body.email}).then( user => {
            if(user) {
                // return res.status(400).json({email: "邮箱已被注册"});
                return res.status(400).json("邮箱已被注册");
            }
            else
            {
                var avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password,
                    identity: req.body.identity
                });
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;

                        newUser.password = hash;

                        newUser
                            .save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    });
                });
            }
        });

});

// $route POST api/users/login
// @desc 返回token jwt(json web token) passport
// @access public
router.post("/login", (req, res) => {
    const email =req.body.email;
    const password  = req.body.password;
    // 查询数据库，ES6中语法，json key/value相同，只写一次
    User.findOne({email})
        .then(user => {
            if(!user) {
                // return res.status(404).json({email:"用户不存在！"});
                return res.status(404).json("用户不存在！");
            }
            // 密码匹配
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch) {
                        const rule = {id: user.id, name: user.name,
                            avatar: user.avatar, identity: user.identity};
                        //token 一个小时后过期
                        jwt.sign(rule, keys.secretOrKey, {expiresIn: 3600}, (err, token) => {
                            if(err) throw err;
                            console.log("login succeed!!!")
                            res.json({
                                success: true,
                                token: "Bearer " + token
                            });
                        });
                        // res.json({message: "success"});
                    } else {
                        // return res.status(400).json({password: "密码错误！"});
                        return res.status(400).json("密码错误！");
                    }
                });

            });
});

// $route GET api/users/current
// @desc return current user
// @access private （只有带token才能访问该接口）
router.get("/current", passport.authenticate("jwt", {session:false}), (req, res) => {
    // res.json({message: "success"});
    // res.json(req.user); //返回 passport.js 的 return  done(null, user); 对象
    res.json({id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    identity: req.user.identity})
})
module.exports = router;
