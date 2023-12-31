import request from "@/utils/request"


// 按照时间进行统计

// xx年有什么电影
export function getMovieByYearApi(params) {
    return request({
        url: '/movieDate/year',
        method: 'get',
        params: {year: params.year}
    })
}

export function getMovieByYearAndMonthApi(params) {
    return request({
        url: '/movieDate/year-month',
        method: 'get',
        params: {year: params.year, month: params.month}
    })
}

export function getMovieByYearAndSeasonApi(params) {
    return request({
        url: '/movieDate/year-season',
        method: 'get',
        params: {year: params.year, season: params.season}
    })
}

export function getMovieCountByYearApi(params) {
    return request({
        url: '/movieDate/years',
        method: 'get',
        params: {startYear: params.startYear, endYear: params.endYear}
    })
}

export function getMovieCountByMonthApi(params) {
    return request({
        url: '/movieDate/months',
        method: 'get',
        params: {year: params.year}
    })
}

export function getStyleFormatByMovieTitleApi(params) {
    return request({
        url: '/movieName/style-format',
        method: 'get',
        params: {title: params.title}
    })
}

export function getDirectorActorCommentRatingByMovieTitleApi(params) {
    return request({
        url: '/movieName/director-actor-comment-rating',
        method: 'get',
        params: {title: params.title}
    })
}


export function getMainActorActorByMovieTitleApi(params) {
    return request({
        url: '/movieName/MainActor-Actor',
        method: 'get',
        params: {title: params.title}
    })
}


export function getDirectorByMovieTitleApi(params) {
    return request({
        url: '/movieName/director',
        method: 'get',
        params: {title: params.title}
    })
}

export function getMovieByDirectorApi(params) {
    return request({
        url: '/movieDirector/getMovieByDirector',
        method: 'get',
        params: {director: params.director}
    })
}

export function getMainActorByActorNameApi(params) {
    return request({
        url: '/movieActor/getMovieByActorName',
        method: 'get',
        params: {ActorName: params.ActorName}
    })
}

export function getHigherMovieByMovieScoreApi(params) {
    return request({
        url: '/movieComment/getHigherMovieByMovieScore',
        method: 'get',
        params: {score: params.score}
    })

}

export function getMoviesByHasPositiveCommentApi() {
    return request({
        url: '/movieComment/getMoviesByHasPositiveComment',
        method: 'get',
    })

}

export function getMoviesByHasALLPositiveCommentApi() {
    return request({
        url: '/movieComment/getMoviesByHasALLPositiveComment',
        method: 'get',
    })
}


export function getMoviesByHasNegativeCommentApi() {
    return request({
        url: '/movieComment/getMoviesByHasNegativeComment',
        method: 'get',
    })
}

export function getMoviesByHasMostPositiveCommentApi() {
    return request({
        url: '/movieComment/getMoviesByHasMostPositiveComment',
        method: 'get',
    })
}


export function getMovieByStyleApi(params) {
    return request({
        url: '/movieStyle/getMovieByStyle',
        method: 'get',
        params: {Style: params.style}
    })
}


export function getMovieByYearDirectorStyleApi(params) {
    return request({
        url: '/movieCombinedQuery/getMovieByYearDirectorStyle',
        method: 'get',
        params: {year: params.year, director: params.director, style: params.style}
    })

}

export function getTopTwentyMovieOnMostFrequentStyleApi(params) {
    return request({
        url: '/movieCombinedQuery/getTopTwentyMovieOnMostFrequentStyle',
        method: 'get',
        params: {year: params.year}
    })

}

export function getMovieByYearScoreApi(params) {
    return request({
        url: '/movieCombinedQuery/getMovieByYearScore',
        method: 'get',
        params: {year: params.year,score: params.score}
    })

}

export function getMovieByYearUserNameApi(params) {
    return request({
        url: '/movieCombinedQuery/getMovieByYearUserName',
        method: 'get',
        params: {year: params.year,userName: params.userName}
    })

}


export function getActorByDirectorApi(params) {
    return request({
        url: '/movieActor/getActorByDirector',
        method: 'get',
        params: {DirectorName: params.DirectorName}
    })

}

