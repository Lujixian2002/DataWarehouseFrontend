import requestForHive from "@/utils/requestForHive";


export function getMovieByYearApiHive(params) {
    return requestForHive({
        url: '/hive/movieDate/getMoviesByYear',
        method: 'get',
        params: { year: params.year }
    })
}


export function getMovieByYearAndMonthApiHive(params) {
    return requestForHive({
        url: '/hive/movieDate/getMoviesByYearMonth',
        method: 'get',
        params: { year: params.year, month: params.month }
    })
}


export function getMovieByYearAndSeasonApiHive(params) {
    return requestForHive({
        url: '/hive/movieDate/getMoviesByYearSeason',
        method: 'get',
        params: { year: params.year, season: params.season }
    })

}


export function getStyleFormatByMovieTitleApiHive(params) {
    return requestForHive({
        url: '/hive/movieName/getStyleFormatByMovieTitle',
        method: 'get',
        params: { title: params.title }
    })

}


export function getMainActorActorByMovieTitleApiHive(params) {
    return requestForHive({
        url: '/hive/movieName/getMainActorActorByMovieTitle',
        method: 'get',
        params: { title: params.title }
    })

}

export function getDirectorByMovieTitleApiHive(params) {
    return requestForHive({
        url: '/hive/movieName/getDirectorByMovieTitle',
        method: 'get',
        params: { title: params.title }
    })

}

export function getMovieByDirectorApiHive(params) {
    return requestForHive({
        url: '/hive/actorDirector/getMovieByDirector',
        method: 'get',
        params: { directorName: params.directorName }
    })

}

export function getMovieByActorApiHive(params) {
    return requestForHive({
        url: '/hive/actorDirector/getMovieByMainActor',
        method: 'get',
        params: { MainActorName: params.ActorName }
    })
}

export function getActorByDirectorApiHive(params) {
    return requestForHive({
        url: '/hive/actorDirector/getActorsByDirector',
        method: 'get',
        params: { DirectorName: params.DirectorName }
    })

}

export function getMovieByStyleApiHive(params) {
    return requestForHive({
        url: '/hive/movieName/getMovieByStyle',
        method: 'get',
        params: { style: params.style }
    })
}