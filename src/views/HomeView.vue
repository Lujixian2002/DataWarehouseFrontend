<template>
  <div class="container">
    <div class="sidebar">
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item title="按照时间进行查询和统计" name="1">
          <div v-for="(content, key) in optionsContent.timeQueries" :key="key" @click="selectItem(key)"
               :class="{ highlighted: selectedItem === key }">
            {{ content }}
          </div>
        </el-collapse-item>
        <el-collapse-item title="按照电影名称进行查询及统计" name="2">
          <div v-for="(content, key) in optionsContent.movieNameQueries" :key="key" @click="selectItem(key)"
               :class="{ highlighted: selectedItem === key }">
            {{ content }}
          </div>
        </el-collapse-item>
        <el-collapse-item title="按照导演进行查询及统计" name="3">
          <div v-for="(content, key) in optionsContent.movieDirectorQueries" :key="key" @click="selectItem(key)"
               :class="{ highlighted: selectedItem === key }">
            {{ content }}
          </div>
        </el-collapse-item>
        <el-collapse-item title="按照演员进行查询及统计" name="4">
          <div v-for="(content, key) in optionsContent.movieActorQueries" :key="key" @click="selectItem(key)"
               :class="{ highlighted: selectedItem === key }">
            {{ content }}
          </div>
        </el-collapse-item>
        <el-collapse-item title="按照演员和导演的关系进行查询及统计" name="5">
          <div v-for="(content, key) in optionsContent.movieActorDirectorQueries" :key="key" @click="selectItem(key)"
               :class="{ highlighted: selectedItem === key }">
            {{ content }}
          </div>
        </el-collapse-item>
        <el-collapse-item title="按照电影类别进行查询及统计" name="6">
          <div v-for="(content, key) in optionsContent.movieStyleQueries" :key="key" @click="selectItem(key)"
               :class="{ highlighted: selectedItem === key }">
            {{ content }}
          </div>
        </el-collapse-item>
        <el-collapse-item title="按照用户评价进行查询及统计" name="7">
          <div v-for="(content, key) in optionsContent.movieCommentsQueries" :key="key" @click="selectItem(key)"
               :class="{ highlighted: selectedItem === key }">
            {{ content }}
          </div>
        </el-collapse-item>
        <el-collapse-item title="按照上述条件的组合查询和统计" name="9">
          <div v-for="(content, key) in optionsContent.movieCombinedQueries" :key="key" @click="selectItem(key)"
               :class="{ highlighted: selectedItem === key }">
            {{ content }}
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="content">
      <!-- 显示选中的内容 -->
      <div v-if="selectedContent" style="margin-bottom: 10px;">
        选中的内容: {{ selectedContent }}
      </div>

      <!-- 搜索框 -->
      <div class="search-section">
        <el-input v-model="searchQuery" placeholder="请输入搜索内容" class="search-input"></el-input>
        <el-button :disabled="searchDisabled" :icon="Search" @click="search"></el-button>
      </div>

      <div v-show="showChoice">
        <el-radio-group v-model="DBChoice" size="large">
          <el-radio-button v-for="item in radioOptions[nowradioOptions]" :key="item.value" :label="item.value">
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <!-- 搜索结果表格 -->
      <el-table :data="searchResults" style="max-height: 300px; overflow-y: auto;">
        <el-table-column v-for="column in nowTableColums" :key="column.prop" :prop="column.prop" :label="column.label"
                         :width="column.width"/>
      </el-table>
      <div v-show="showChoice">
        <div v-show="nowradioOptions==='option1'">
          <el-progress :percentage="percentageForMysql" style="width: 800px">
            <el-button text>Mysql查询用时:{{TimeForMysql}}毫秒</el-button>
          </el-progress>
          <el-progress :percentage="percentageForHive" style="width: 800px">
            <el-button text>Hive查询用时:{{TimeForHive}}毫秒</el-button>
          </el-progress>
        </div>
        <div v-show="nowradioOptions==='option2'">
          <el-progress :percentage="percentageForMysql" style="width: 800px">
            <el-button text>Mysql查询用时:{{TimeForMysql}}毫秒</el-button>
          </el-progress>
          <el-progress :percentage="percentageForHive" style="width: 800px">
            <el-button text>Hive查询用时:{{TimeForHive}}毫秒</el-button>
          </el-progress>
          <el-progress :percentage="percentageForNeo4j" style="width: 800px">
            <el-button text>Hive查询用时:{{TimeForNeo4j}}毫秒</el-button>
          </el-progress>
        </div>
      </div>
      <!-- 触发抽屉的按钮 -->
      <div class="drawer-button">
        <el-button @click="drawerVisible = true">展开抽屉</el-button>
      </div>

      <!-- 抽屉组件 -->
      <el-drawer v-model="drawerVisible" title="查询对比" :direction="'btt'" size="50%">
        <span>Hi, there!</span>
      </el-drawer>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {Search} from '@element-plus/icons-vue'
import {
  getActorByDirectorApi,getActorByDirectorApiNeo4j,
  getDirectorActorCommentRatingByMovieTitleApi,
  getDirectorByMovieTitleApi,
  getHigherMovieByMovieScoreApi,
  getMainActorActorByMovieTitleApi,
  getMainActorByActorNameApi,
  getMovieByDirectorApi, getMovieByStyleApi,
  getMovieByYearAndMonthApi,
  getMovieByYearAndSeasonApi,
  getMovieByYearApi, getMovieByYearDirectorStyleApi, getMovieByYearScoreApi, getMovieByYearUserNameApi,
  getMovieCountByMonthApi,
  getMovieCountByYearApi,
  getMoviesByHasALLPositiveCommentApi, getMoviesByHasMostPositiveCommentApi,
  getMoviesByHasNegativeCommentApi,
  getMoviesByHasPositiveCommentApi,
  getStyleFormatByMovieTitleApi, getTopTwentyMovieOnMostFrequentStyleApi,
  // Neo4j
  findMovieByDirectorApiNeo4j,
  findMovieByActorApiNeo4j


} from "@/api/test";
import {
  getActorByDirectorApiHive,
  getDirectorByMovieTitleApiHive,
  getMainActorActorByMovieTitleApiHive, getMovieByActorApiHive, getMovieByDirectorApiHive,
  getMovieByYearAndMonthApiHive,
  getMovieByYearAndSeasonApiHive,
  getMovieByYearApiHive,
  getStyleFormatByMovieTitleApiHive
} from "@/api/APIForHive";
// import axios from 'axios'; // 导入axios
// import {
//   getMovieByYearApi
// } from "@/api/test.js";
// import async from "async";

const activeName = ref('0')

const DBChoice = ref('')

const selectedItem = ref('')
const selectedContent = ref('')

const selectedTableColums = ref('')

const nowTableColums = ref([])

const nowradioOptions = ref("")

const optionsContent = {
  'timeQueries': {
    '1-1': '1. xx年有什么电影',
    '1-2': '2. xx年xx月有什么电影',
    '1-3': '3. xx年xx季度有什么电影',
    '1-4': '4. 每一年发行的电影数量',
    '1-5': '5. XX年内每个月发行的电影数量'
  },
  'movieNameQueries': {
    '2-1': '1. xx电影有哪些版本和风格',
    '2-2': '2. xx电影的主要信息',
    '2-3': '3. xx电影的主演和参演演员名单',
    '2-4': '4. xx电影的导演名单'
  },
  'movieDirectorQueries': {
    '3-1': '1. xx导演一共有哪些电影',
  },
  'movieActorQueries': {
    '4-1': '1. xx演员一共有哪些电影',
  },
  'movieActorDirectorQueries':{
    '5-1': '1. xx导演合作的演员有多少，从高到低排序，返回演员名称以及演员数量',
  },
  'movieStyleQueries': {
    '6-1': '1. xx风格的电影有哪些',
  },
  'movieCommentsQueries': {
    '7-1': '1. 用户评分xx分以上的电影有哪些',
    '7-2': '2. 用户评价中有正面评价的电影有哪些',
    '7-3': '3. 用户评价中全是正面评价的电影有哪些',
    '7-4': '4. 用户评价中有差评的电影有哪些',
    '7-5': '5. 好评数最多的电影有哪些',
  },
  'movieCombinedQueries': {
    '9-1': '1. 查询xx年以来xx执导的所有xx风格的电影',
    '9-2': '2. 查询xx年中出现最多次的电影类别，以及该类别中最受欢迎的前20部电影',
    '9-3': '3. 查询xx年中评分大于xx的电影',
    '9-4': '4. 查询xx用户（userName）在xx年里评论过的电影',
  }
};

const tableColums = {
  '1-1': [
    {prop: 'title', label: '电影名称'},
    {prop: 'score', label: '评分'},
    {prop: 'month', label: '发行月份'},
  ],
  '1-2': [
    {prop: 'title', label: '电影名称'},
    {prop: 'score', label: '评分'},
    {prop: 'month', label: '发行月份'},
  ],
  '1-3': [
    {prop: 'title', label: '电影名称'},
    {prop: 'score', label: '评分'},
    {prop: 'month', label: '发行月份'},
  ],
  '1-4': [
    {prop: 'year', label: '发行年份'},
    {prop: 'count', label: '发行数量'},
  ],
  '1-5': [
    {prop: 'year', label: '发行年份'},
    {prop: 'month', label: '发行月份'},
    {prop: 'count', label: '发行数量'},
  ],
  '2-1': [
    {prop: 'format', label: '版本'},
    {prop: 'style', label: '风格'},
  ],
  '2-2': [
    {prop: 'directorNum', label: '导演数量'},
    {prop: 'actorNum', label: '演员数量'},
    {prop: 'commentNum', label: '评论数量'},
    {prop: 'rating', label: '评分'},
  ],
  '2-3': [
    {prop: 'mainActor', label: '主要演员'},
    {prop: 'actor', label: '演员'},
  ],
  '2-4': [
    {prop: 'director', label: '导演'},
  ],
  '3-1': [
    {prop: 'title', label: '电影名称'},
  ],
  '4-1': [
    {prop: 'title', label: '电影名称'},
  ],
  '5-1': [
    {prop: 'actor', label: '演员'},
  ],
  '6-1': [
    {prop: 'title', label: '电影名称'},
  ],
  '7-1': [
    {prop: 'title', label: '电影名称'},
    {prop: 'score', label: '评分'},
    {prop: 'year', label: '发行年份'},
  ],
  '7-2': [
    {prop: 'title', label: '电影名称'},
    {prop: 'score', label: '评分'},
    {prop: 'year', label: '发行年份'},
  ],
  '7-3': [
    {prop: 'title', label: '电影名称'},
    {prop: 'score', label: '评分'},
    {prop: 'year', label: '发行年份'},
  ],
  '7-4': [
    {prop: 'title', label: '电影名称'},
    {prop: 'score', label: '评分'},
    {prop: 'year', label: '发行年份'},
  ],
  '7-5': [
    {prop: 'title', label: '电影名称'},
    {prop: 'score', label: '评分'},
    {prop: 'year', label: '发行年份'},
  ],
  '9-1': [
    {prop: 'title', label: '电影名称'},
    {prop: 'score', label: '评分'},
    {prop: 'year', label: '发行年份'},
  ],
  '9-2': [
    {prop: 'style', label: '类别'},
    {prop: 'title', label: '电影名称'},
  ],
  '9-3': [
    {prop: 'title', label: '电影名称'},
    {prop: 'score', label: '评分'},
    {prop: 'year', label: '发行年份'},
  ],
  '9-4': [
    {prop: 'title', label: '电影名称'},
    {prop: 'score', label: '评分'},
    {prop: 'year', label: '发行年份'},
  ],
}

const optionOneIndex=['1-1','1-2','1-3','2-1','2-3','2-4'];
const optionTwoIndex=['3-1','4-1','5-1'];

const selectItem = (key) => {
  selectedItem.value = key;
  selectedContent.value = Object.values(optionsContent)
      .flatMap(group => group)
      .find(content => content[key])[key];
  selectedTableColums.value = key
  nowTableColums.value = tableColums[selectedTableColums.value]

  if(optionOneIndex.includes(key))
  {
    showChoice.value=true
    nowradioOptions.value='option1'
  }
  else if(optionTwoIndex.includes(key))
  {
    showChoice.value=true
    nowradioOptions.value='option2'
  }
  else {
    showChoice.value=false
  }

  TimeForHive.value=0.0
  TimeForMysql.value=0.0
  TimeForNeo4j.value=0.0
  percentageForMysql.value=0.0
  percentageForHive.value=0.0
  percentageForNeo4j.value=0.0
};


const searchQuery = ref('');
const searchResults = ref([]);
const drawerVisible = ref(false);
const searchDisabled = ref(false);
const showChoice = ref(false);

const radioOptions = {
      'option1': [
        {value: "1", label: "Mysql", size: "large"},
        {value: "2", label: "Hive", size: "large"},
        // Add more options as needed
      ],
      'option2': [
        {value: "1", label: "Mysql", size: "large"},
        {value: "2", label: "Hive", size: "large"},
        {value: "3", label: "Neo4j", size: "large"},
        // Add more options as needed
      ],
    };


const TimeForMysql=ref(0.0)
const TimeForHive=ref(0.0)
const TimeForNeo4j=ref(0.0)
const percentageForMysql=ref(0.0)
const percentageForHive=ref(0.0)
const percentageForNeo4j=ref(0.0)

async function search() {
  // 首先切分字符串
  let query = searchQuery.value;
  let queryArray = query.split("||");
  console.log(queryArray);

  // 然后根据不同的查询类型进行查询
  if (selectedItem.value === '1-1') {
    // 按照年份查询
    let params = {
      year: queryArray[0],
    };
    let res;
    if(DBChoice.value==='1')
    {
      res = await getMovieByYearApi(params);
      TimeForMysql.value=res.data.elapsedTime
    }
    else if(DBChoice.value==='2')
    {
      res = await getMovieByYearApiHive(params);
      TimeForHive.value=res.data.elapsedTime
    }

    if(TimeForMysql.value!==0&&TimeForHive.value!==0)
    {
      let max_time=Math.max(TimeForMysql.value,TimeForHive.value)
      percentageForMysql.value=TimeForMysql.value/(max_time)*100
      percentageForHive.value=TimeForHive.value/(max_time)*100
    }


    let resData = [];
    if (res.data && res.data.movies && Array.isArray(res.data.movies)) {
      res.data.movies.forEach(movie => {
        resData.push({
          title: movie.title,
          score: movie.movieScore,
          month: movie.month,
        });
      });

      searchResults.value = resData;
    } else {
      console.error("Invalid response format");
    }
  } else if (selectedItem.value === '1-2') {
    // 按照年份和月份查询
    let params = {
      year: queryArray[0],
      month: queryArray[1],
    };
    let res;
    if(DBChoice.value==='1')
    {
      res = await getMovieByYearAndMonthApi(params);
      TimeForMysql.value=res.data.elapsedTime
    }
    else if(DBChoice.value==='2')
    {
      res = await getMovieByYearAndMonthApiHive(params);
      TimeForHive.value=res.data.elapsedTime
    }
    let resData = [];
    if (res.data && res.data.movies && Array.isArray(res.data.movies)) {
      res.data.movies.forEach(movie => {
        resData.push({
          title: movie.title,
          score: movie.movieScore,
          month: movie.month,
        });
      });

      if(TimeForMysql.value!==0&&TimeForHive.value!==0)
      {
        let max_time=Math.max(TimeForMysql.value,TimeForHive.value)
        percentageForMysql.value=TimeForMysql.value/(max_time)*100
        percentageForHive.value=TimeForHive.value/(max_time)*100
      }

      searchResults.value = resData;
    } else {
      console.error("Invalid response format");
    }
  } else if (selectedItem.value === '1-3') {
    // 按照年份和季度查询
    let params = {
      year: queryArray[0],
      season: queryArray[1],
    };
    let res;
    if(DBChoice.value==='1')
    {
      res = await getMovieByYearAndSeasonApi(params);
      TimeForMysql.value=res.data.elapsedTime
    }
    else if(DBChoice.value==='2')
    {
      res = await getMovieByYearAndSeasonApiHive(params);
      TimeForHive.value=res.data.elapsedTime
    }

    let resData = [];
    if (res.data && res.data.movies && Array.isArray(res.data.movies)) {
      res.data.movies.forEach(movie => {
        resData.push({
          title: movie.title,
          score: movie.movieScore,
          month: movie.month,
        });
      });

      if(TimeForMysql.value!==0&&TimeForHive.value!==0)
      {
        let max_time=Math.max(TimeForMysql.value,TimeForHive.value)
        percentageForMysql.value=TimeForMysql.value/(max_time)*100
        percentageForHive.value=TimeForHive.value/(max_time)*100
      }

      searchResults.value = resData;
    } else {
      console.error("Invalid response format");
    }
  } else if (selectedItem.value === '1-4') {
    // 按照年份查询每年的电影数量
    let params = {
      startYear: queryArray[0],
      endYear: queryArray[1],
    };
    let res = await getMovieCountByYearApi(params);
    let resData = [];
    if (res.data) {
      res.data.forEach(movie => {
        resData.push({
          year: movie.date,
          count: movie.count,
        });
      });

      searchResults.value = resData;
    } else {
      console.error("Invalid response format");
    }
  } else if (selectedItem.value === '1-5') {
    // 按照年份查询每年的电影数量
    let params = {
      year: queryArray[0],
    };
    let res = await getMovieCountByMonthApi(params);
    let resData = [];
    if (res.data) {
      res.data.forEach(movie => {
        resData.push({
          year: queryArray[0],
          month: movie.date,
          count: movie.count,
        });
      });

      searchResults.value = resData;
    } else {
      console.error("Invalid response format");
    }
  } else if (selectedItem.value === '2-1') {
    let params = {
      title: queryArray[0],
    };
    let res;
    if(DBChoice.value==='1')
    {
      res = await getStyleFormatByMovieTitleApi(params);
      TimeForMysql.value=res.data.elapsedTime
    }
    else if(DBChoice.value==='2')
    {
      res = await getStyleFormatByMovieTitleApiHive(params);
      TimeForHive.value=res.data.elapsedTime
    }
    let resData = [];
    if (res.data) {


      let length1 = res.data.format.length;
      let length2 = res.data.style.length;

      let max_length = length1 > length2 ? length1 : length2;

      for (let i = 0; i < max_length; i++) {
        resData.push({
          format: res.data.format[i],
          style: res.data.style[i],
        });
      }

      if(TimeForMysql.value!==0&&TimeForHive.value!==0)
      {
        let max_time=Math.max(TimeForMysql.value,TimeForHive.value)
        percentageForMysql.value=TimeForMysql.value/(max_time)*100
        percentageForHive.value=TimeForHive.value/(max_time)*100
      }

      searchResults.value = resData;
    } else {
      console.error("Invalid response format");
    }
  } else if (selectedItem.value === '2-2') {
    let params = {
      title: queryArray[0],
    };
    let res = await getDirectorActorCommentRatingByMovieTitleApi(params);
    let resData = [];
    if (res.data) {
      resData.push({
        directorNum: res.data.directorNum,
        actorNum: res.data.actorNum,
        commentNum: res.data.commentNum,
        rating: res.data.rating,
      });
      searchResults.value = resData;
    } else {
      console.error("Invalid response format");
    }
  } else if (selectedItem.value === '2-3') {
    let params = {
      title: queryArray[0],
    };
    let res;
    if(DBChoice.value==='1')
    {
      res = await getMainActorActorByMovieTitleApi(params);
      TimeForMysql.value=res.data.elapsedTime
    }
    else if(DBChoice.value==='2')
    {
      res = await getMainActorActorByMovieTitleApiHive(params);
      TimeForHive.value=res.data.elapsedTime
    }
    let resData = [];
    if (res.data) {
      let length1 = res.data.mainActor.length;
      let length2 = res.data.actor.length;

      let max_length = length1 > length2 ? length1 : length2;

      for (let i = 0; i < max_length; i++) {
        resData.push({
          mainActor: res.data.mainActor[i],
          actor: res.data.actor[i],
        });
      }

      if(TimeForMysql.value!==0&&TimeForHive.value!==0)
      {
        let max_time=Math.max(TimeForMysql.value,TimeForHive.value)
        percentageForMysql.value=TimeForMysql.value/(max_time)*100
        percentageForHive.value=TimeForHive.value/(max_time)*100
      }

      searchResults.value = resData;
    } else {
      console.error("Invalid response format");
    }
  } else if (selectedItem.value === '2-4') {
    let params = {
      title: queryArray[0],
    };
    let res;
    if(DBChoice.value==='1')
    {
      res = await getDirectorByMovieTitleApi(params);
      TimeForMysql.value=res.data.elapsedTime
    }
    else if(DBChoice.value==='2')
    {
      res = await getDirectorByMovieTitleApiHive(params);
      TimeForHive.value=res.data.elapsedTime
    }
    let resData = [];
    if (res.data) {
      let length = res.data.director.length;
      for (let i = 0; i < length; i++) {
        resData.push({
          director: res.data.director[i],
        });
      }

      if(TimeForMysql.value!==0&&TimeForHive.value!==0)
      {
        let max_time=Math.max(TimeForMysql.value,TimeForHive.value)
        percentageForMysql.value=TimeForMysql.value/(max_time)*100
        percentageForHive.value=TimeForHive.value/(max_time)*100
      }
      searchResults.value = resData;
    } else {
      console.error("Invalid response format");
    }
  } else if (selectedItem.value === '3-1') {
    let params = {
      director: queryArray[0],
      directorName: queryArray[0],
    };
    let res;
    if(DBChoice.value==='1')
    {
      res = await getMovieByDirectorApi(params);
      TimeForMysql.value=res.data.elapsedTime
    }
    else if(DBChoice.value==='2')
    {
      res = await getMovieByDirectorApiHive(params);
      TimeForHive.value=res.data.elapsedTime
    }
    else if(DBChoice.value==='3')
    {
      res = await findMovieByDirectorApiNeo4j(params);
      TimeForNeo4j.value=res.data.time
    }

    let resData = [];
    // 关系型查询
    if (res.data) {
    if(DBChoice.value==='1') {
      let length = res.data.movieName.length;
      for (let i = 0; i < length; i++) {
        resData.push({
          title: res.data.movieName[i],
        });
      }
    }
    else if(DBChoice.value==='2'){
      let length = res.data.movies.length;
      for (let i = 0; i < length; i++) {
        resData.push({
          title: res.data.movies[i].title,
        });
      }
    }
    else if(DBChoice.value==='3'){
      let length = res.data["Nodes:"].length;
      console.log(length)
      for (let i = 0; i < length; i++) {
        resData.push({
            title: res.data["Nodes:"][i],
          });
        }
    }
    
    if(TimeForMysql.value!==0&&TimeForHive.value!==0&&TimeForNeo4j.value!==0)
    {
      let max_time=Math.max(TimeForMysql.value,TimeForHive.value,TimeForNeo4j.value)
      percentageForMysql.value=TimeForMysql.value/(max_time)*100
      percentageForHive.value=TimeForHive.value/(max_time)*100
      percentageForNeo4j.value=TimeForNeo4j.value/(max_time)*100
    }
    searchResults.value = resData;
  } else {
    console.error("Invalid response format");
  }


  } else if (selectedItem.value === '4-1') {
    let params = {
      ActorName: queryArray[0],
    };
    let res;
    if(DBChoice.value==='1')
    {
      res = await  getMainActorByActorNameApi(params);
      TimeForMysql.value=res.data.elapsedTime
    }
    else if(DBChoice.value==='2')
    {
      res = await getMovieByActorApiHive(params);
      TimeForHive.value=res.data.elapsedTime
    }
    else if(DBChoice.value==='3')
    {
      res = await findMovieByActorApiNeo4j(params);
      TimeForNeo4j.value=res.data.time;
      console.log(DBChoice.value)
    }

    let resData = [];
    if(DBChoice.value==='1')
    {
    if (res.data) {
      let length = res.data.movieName.length;
      for (let i = 0; i < length; i++) {
        resData.push({
          title: res.data.movieName[i],
        });
      }
    }
    else if(DBChoice.value==='2')
    {
      let length = res.data.movies.length;
      for (let i = 0; i < length; i++) {
        resData.push({
          title: res.data.movies[i].title,
        });
      }
    }
    else if(DBChoice.value==='3'){
      let length = res.data["Nodes:"].length;
      console.log(length)
      for (let i = 0; i < length; i++) {
        resData.push({
            title: res.data["Nodes:"][i],
          });
        }
    }
      if(TimeForMysql.value!==0&&TimeForHive.value!==0&&TimeForNeo4j.value!==0)
      {
        let max_time=Math.max(TimeForMysql.value,TimeForHive.value,TimeForNeo4j.value)
        percentageForMysql.value=TimeForMysql.value/(max_time)*100
        percentageForHive.value=TimeForHive.value/(max_time)*100
        percentageForNeo4j.value=TimeForNeo4j.value/(max_time)*100
      }

      searchResults.value = resData;
    } else {
      console.error("4-1 Invalid response format");
    }
  }
  else if(selectedItem.value==='5-1')
  {
    let params = {
      DirectorName: queryArray[0],
    };
    let res;
    if(DBChoice.value==='1')
    {
      res = await getActorByDirectorApi(params);
      TimeForMysql.value=res.data.elapsedTime
    }
    else if(DBChoice.value==='2')
    {
      res = await getActorByDirectorApiHive(params);
      TimeForHive.value=res.data.elapsedTime
    }
    else if(DBChoice.value==='3')
    {
      res = await getActorByDirectorApiNeo4j(params);
      TimeForNeo4j.value=res.data.time
    }

    let resData = [];
    try{
      if (res.data) {
      if(res.data.names===null)
      {
        return
      }
      let length = res.data.names.length;
      for (let i = 0; i < length; i++) {
        resData.push({
          actor: res.data.names[i],
        });
      }


      if(TimeForMysql.value!==0&&TimeForHive.value!==0&&TimeForNeo4j.value!==0)
      {
        let max_time=Math.max(TimeForMysql.value,TimeForHive.value,TimeForNeo4j.value)
        percentageForMysql.value=TimeForMysql.value/(max_time)*100
        percentageForHive.value=TimeForHive.value/(max_time)*100
        percentageForNeo4j.value=TimeForNeo4j.value/(max_time)*100
      }

      searchResults.value = resData;
    } else {
      console.error("Invalid response format");
    }
    }catch{
      // 图数据库处理
      let length = res.data.length;
      console.log(length)
      for (let i = 0; i < length; i++) {
        resData.push({
            actor: res.data[i].name2,
          });
        }
        searchResults.value = resData;
    }

  }
  else if (selectedItem.value === '6-1') {
    let params = {
      style: queryArray[0],
    };
    let res = await getMovieByStyleApi(params);
    let resData = [];
    if (res.data) {
      let length = res.data.movieName.length;
      for (let i = 0; i < length; i++) {
        resData.push({
          title: res.data.movieName[i],
        });
      }
      searchResults.value = resData;
    } else {
      console.error("Invalid response format");
    }
  } else if (selectedItem.value === '7-1') {
    let params = {
      score: queryArray[0],
    };
    let res = await getHigherMovieByMovieScoreApi(params);
    let resData = [];
    if (res.data && res.data.movies && Array.isArray(res.data.movies)) {
      res.data.movies.forEach(movie => {
        resData.push({
          title: movie.title,
          score: movie.movieScore,
          year: movie.year,
        });
      });

      searchResults.value = resData;
    } else {
      console.error("Invalid response format");
    }
  } else if (selectedItem.value === '7-2') {
    searchDisabled.value = true;
    let res = await getMoviesByHasPositiveCommentApi();
    let resData = [];
    if (res.data && res.data.movies && Array.isArray(res.data.movies)) {
      res.data.movies.forEach(movie => {
        resData.push({
          title: movie.title,
          score: movie.movieScore,
          year: movie.year,
        });
      });
      searchDisabled.value = false;
      searchResults.value = resData;
    } else {
      console.error("Invalid response format");
    }
  } else if (selectedItem.value === '7-3') {
    searchDisabled.value = true;
    let res = await getMoviesByHasALLPositiveCommentApi();
    let resData = [];
    if (res.data && res.data.movies && Array.isArray(res.data.movies)) {
      res.data.movies.forEach(movie => {
        resData.push({
          title: movie.title,
          score: movie.movieScore,
          year: movie.year,
        });
      });
      searchDisabled.value = false;
      searchResults.value = resData;
    } else {
      console.error("Invalid response format");
    }
  } else if (selectedItem.value === '7-4') {
    searchDisabled.value = true;
    let res = await getMoviesByHasNegativeCommentApi();
    let resData = [];
    if (res.data && res.data.movies && Array.isArray(res.data.movies)) {
      res.data.movies.forEach(movie => {
        resData.push({
          title: movie.title,
          score: movie.movieScore,
          year: movie.year,
        });
      });
      searchDisabled.value = false;
      searchResults.value = resData;
    } else {
      console.error("Invalid response format");
    }
  } else if (selectedItem.value === '7-5') {
    searchDisabled.value = true;
    let res = await getMoviesByHasMostPositiveCommentApi();
    let resData = [];
    if (res.data && res.data.movies && Array.isArray(res.data.movies)) {
      res.data.movies.forEach(movie => {
        resData.push({
          title: movie.title,
          score: movie.movieScore,
          year: movie.year,
        });
      });
      searchDisabled.value = false;
      searchResults.value = resData;
    } else {
      console.error("Invalid response format");
    }
  } else if (selectedItem.value === '9-1') {
    let params = {
      year: queryArray[0],
      director: queryArray[1],
      style: queryArray[2],
    };

    let res = await getMovieByYearDirectorStyleApi(params);
    let resData = [];
    if (res.data && res.data.movies && Array.isArray(res.data.movies)) {
      res.data.movies.forEach(movie => {
        resData.push({
          title: movie.title,
          score: movie.movieScore,
          year: movie.year,
        });
      });
      searchResults.value = resData;
    } else {
      console.error("Invalid response format");
    }
  } else if (selectedItem.value === '9-2') {
    let params = {
      year: queryArray[0],
    };

    let res = await getTopTwentyMovieOnMostFrequentStyleApi(params);
    let resData = [];
    if (res.data && res.data.movies && Array.isArray(res.data.movies)) {
      res.data.movies.forEach(movie => {
        resData.push({
          style: res.data.style,
          title: movie.title,
        });
      });
      searchResults.value = resData;
    } else {
      console.error("Invalid response format");
    }
  } else if (selectedItem.value === '9-3') {
    let params = {
      year: queryArray[0],
      score: queryArray[1],
    };

    let res = await getMovieByYearScoreApi(params);
    let resData = [];
    if (res.data && res.data.movies && Array.isArray(res.data.movies)) {
      res.data.movies.forEach(movie => {
        resData.push({
          title: movie.title,
          score: movie.movieScore,
          year: movie.year,
        });
      });
      searchResults.value = resData;
    } else {
      console.error("Invalid response format");
    }
  } else if (selectedItem.value === '9-4') {
    let params = {
      userName: queryArray[0],
      year: queryArray[1],
    };
    searchDisabled.value = true;
    let res = await getMovieByYearUserNameApi(params);
    let resData = [];
    if (res.data && res.data.movies && Array.isArray(res.data.movies)) {
      res.data.movies.forEach(movie => {
        resData.push({
          title: movie.title,
          score: movie.movieScore,
          year: movie.year,
        });
      });
      searchDisabled.value = false;
      searchResults.value = resData;
    } else {
      console.error("Invalid response format");
    }
  }
  // else if(selectedItem.value==='9-4')
  // {
  //   let params = {
  //     userName: queryArray[0],
  //     year: queryArray[1],
  //   };
  //
  //   let res = await getMovieByYearAnd
  // }
  // else if(selectedItem.value==='7-4')
  // {
  //   let params = {
  //     title: queryArray[0],
  //   };
  //   let res = await getMovieByYearAnd
}

</script>

<style>
.container {
  display: flex;
}

.sidebar {
  flex: 0 0 600px;
  margin-left: 70px;
  margin-top: 5px;
}

.content {
  flex: 1;
}

.el-collapse {
  font-size: 1.2em;
  /* 增加字体大小 */
  margin: 20px;
  /* 增加外边距 */
  padding: 10px;
  /* 增加内边距 */
}

.el-collapse-item__content div {
  text-align: left;
  /* 确保文本左对齐 */
  margin-bottom: 15px;
  /* 增加底部外边距 */
}

.highlighted {
  background-color: #f0f0f0;
  /* 高亮颜色，根据需要调整 */
}

.search-input {
  width: 50%;
  /* 调整输入框大小 */
  max-width: 300px;
  /* 最大宽度 */
}

.drawer-button {
  position: absolute;
  left: 70%;
  bottom: 10%;
  /* 将按钮推到底部 */
}
</style>
