<template>
    <div class="fillcontain">
        <div>
            <!--必须使用model绑定属性，否则内部无法使用search_data-->
            <el-form :inline="true" ref="add_data" :model="search_data">
                <!--筛选-->
                <el-form-item label="按照时间筛选：">
                    <el-date-picker
                            v-model="search_data.startTime"
                            type="datetime"
                            placeholder="选择开始时间">
                    </el-date-picker> --
                    <el-date-picker
                            v-model="search_data.endTime"
                            type="datetime"
                            placeholder="选择结束时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" icon="search" @click="handleSearch">筛选</el-button>
                </el-form-item>
                <el-form-item class="btnRight">
                    <el-button
                            type="primary"
                            size="small"
                            icon="view"
                            v-if="user.identity == 'manager'"
                            @click="handleAdd">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table_container">
            <el-table
                    max-height="450"
                    border
                    v-if="tableData.length > 0"
                    :data="tableData"
                    style="width: 100%">
                <el-table-column
                        type="index"
                        label="序号"
                        align='center'
                        width="70">
                </el-table-column>
                <el-table-column
                        prop="date"
                        align="center"
                        label="创建时间"
                        width="250">
                    <!--slot-scope="scope"，这样在template里就可以引用scope.row.date了-->
                    <template slot-scope="scope">
                        <el-icon name="time"></el-icon>
                        <span style="margin-left: 10px">{{ scope.row.date }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="type"
                        label="收支类型"
                        align='center'
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="describe"
                        label="收支描述"
                        align='center'
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="income"
                        label="收入"
                        align='center'
                        width="170">
                    <template slot-scope="scope">
                        <span style="color:#00d053">+ {{ scope.row.income }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="expend"
                        label="支出"
                        align='center'
                        width="170">
                    <template slot-scope="scope">
                        <span style="color:#f56767">- {{ scope.row.expend }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="cash"
                        label="账户现金"
                        align='center'
                        width="170">
                    <template slot-scope="scope">
                        <span style="color:#4db3ff">{{ scope.row.cash }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="remark"
                        label="备注"
                        align='center'
                        width="220">
                </el-table-column>
                <el-table-column
                                 prop="operation"
                                 align='center'
                                 label="操作"
                                 fixed="right"
                                 v-if="user.identity == 'manager'"
                                 width="180">
                    <template slot-scope="scope">
                        <el-button
                                type="warning"
                                size="small"
                                icon='edit'
                                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                                size="small"
                                type="danger"
                                icon='delete'
                                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
                </el-table>
                <!--分页-->
                <el-row>
                    <!--element-ui栅格布局，分成24列，这里24，将占满整行-->
                    <el-col :span="24">
                        <div class="pagination">
                            <el-pagination
                                    @size-change="handleSizeChange"
                                    @current-change="handleCurrentChange"
                                    :current-page.sync="paginations.page_index"
                                    :page-sizes="paginations.page_sizes"
                                    :page-size="paginations.page_size"
                                    :layout="paginations.layout"
                                    :total="paginations.total">
                            </el-pagination>
                        </div>
                    </el-col>
                </el-row>
        </div>
        <!--使用Dialog组件，绑定dialog属性-->
        <Dialog :dialog="dialog" :formData="formData" @update="getProfile"></Dialog>
    </div>
</template>
<script>
    import Dialog from '../components/Dialog'

    export default
    {
        name:"fundList",
        data() {
            return {
                search_data: {
                    startTime: '',
                    endTime: ''
                },
                filterTableData: [],
                /*分页组件使用的属性*/
                paginations: {
                    page_index: 1, //当前位于哪一页
                    total: 0, // 总数
                    page_size: 5, // 当前选定的一页显示多少条
                    page_sizes: [5,10,15,20], //每页显示多少条（选项）
                    layout: 'total,sizes,prev,pager,next,jumper' //分页组件功能选项
                },
                tableData: [],  //当前显示的数据
                allTableData: [], //所有数据
                formData: {
                    type: '',
                    describe: '',
                    income: '',
                    expend: '',
                    cash: '',
                    remark: '',
                    id: ''
                },
                dialog:{
                    show: false,
                    title: '',
                    option: 'edit'
                }
            };
        },
        computed: {
            user() {
                return this.$store.getters.user;
            }
        },
        created() {
            this.getProfile();
        },
        methods:{
            getProfile() {
                // 请求后端服务，获取表格数据
                this.$axios.get("/api/profiles")
                    .then(res => {
                        this.allTableData = res.data;
                        this.filterTableData = res.data;
                        //设置分页数据
                        this.setPaginations();
                    })
                    .catch(err => console.log(err));
            },
            setPaginations() {
                //分页属性设置
                this.paginations.total = this.allTableData.length;
                this.paginations.page_index = 1;
                this.paginations.page_size = 5;
                // 设置默认的分页数据
                this.tableData = this.allTableData.filter((item, index) => {
                    return index < this.paginations.page_size;
                });
            },
            handleEdit(index, row){
                // console.log(this.dialog);
                this.dialog = {
                    show: true,
                    title: "修改资金信息",
                    option: 'edit'
                };
                this.formData = {
                    type: row.type,
                    describe: row.describe,
                    income: row.income,
                    expend: row.expend,
                    cash: row.cash,
                    remark: row.remark,
                    id: row._id
                }
            },
            handleDelete(index, row){
                this.$axios.delete(`/api/profiles/delete/${row._id}`)
                    .then(res => {
                        this.$message("删除成功！");
                        // 刷新页面
                        this.getProfile();
                    });
            },
            handleAdd() {
                this.dialog = {
                    show: true,
                    title: "添加资金信息",
                    option: 'add'
                };
                this.formData = {
                    type: "",
                    describe: "",
                    income: "",
                    expend: "",
                    cash: "",
                    remark: "",
                    id: ""
                }
            },
            handleSizeChange(page_size) {
                // 切换size
                this.paginations.page_index = 1;
                this.paginations.page_size = page_size;
                // 设置默认的分页数据
                this.tableData = this.allTableData.filter((item, index) => {
                    return index < page_size;
                });
            },
            handleCurrentChange(page) {
                // 获取当前页
                let index = this.paginations.page_size *(page-1);
                // 数据的总数
                let nums = this.paginations.page_size * page;
                // 容器
                let tables = [];
                for(let i = index; i < nums; i++) {
                    if(this.allTableData[i]) {
                        tables.push(this.allTableData[i]);
                    }
                    this.tableData = tables;
                }
            },
            handleSearch() {
                // 筛选
                if(!this.search_data.startTime || !this.search_data.endTime) {
                    this.$message({
                        type: "warning",
                        message: "请选择时间区间"
                    });
                    this.getProfile();
                    return;
                }
                const sTime = this.search_data.startTime.getTime();
                const eTime = this.search_data.endTime.getTime();

                this.allTableData = this.filterTableData.filter(item => {
                    // console.log(item);
                    let date = new Date(item.date);
                    let time = date.getTime();
                    return time >= sTime && time <= eTime;
                });
                //设置分页数据
                this.setPaginations();
            }
        },
        //注册Dialog组件
        components: {
            Dialog
        }
    }
</script>
<style scoped>
    .fillcontain {
        width: 100%;
        height: 100%;
        padding: 16px;
        box-sizing: border-box;
    }
    .btnRight {
        float: right;
    }
    .pagination {
        text-align: right;
        margin-top: 10px;
    }
</style>
