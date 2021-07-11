import Mock from 'mockjs'


Mock.mock('/api/get/img',{
    "src":"/static/img/111.adbdb70.jpeg",
    "random_data":[0,1,2,3,4,5,6,7,8].sort(function () {
          return 0.5 - Math.random();
        })
})


Mock.setup({
    timeout: '200-600'
})