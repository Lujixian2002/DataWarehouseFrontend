import request from "@/utils/request"


// 按照时间进行统计

// xx年有什么电影
export function getMovieByYearApi(params){
    return request({
        url:'/movieDate/year',
        method:'get',
        params: {year:params.year}
    })
}