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
          <div>
            Simplify the process: keep operating process simple and intuitive;
          </div>
          <div>
            Definite and clear: enunciate your intentions clearly so that the
            users can quickly understand and make decisions;
          </div>
          <div>
            Easy to identify: the interface should be straightforward, which helps
            the users to identify and frees them from memorizing and recalling.
          </div>
        </el-collapse-item>
        <el-collapse-item title="按照演员进行查询及统计" name="4">
          <div>
            Decision making: giving advices about operations is acceptable, but do
            not make decisions for the users;
          </div>
          <div>
            Controlled consequences: users should be granted the freedom to
            operate, including canceling, aborting or terminating current
            operation.
          </div>
        </el-collapse-item>
        <el-collapse-item title="按照演员和导演的关系进行查询及统计" name="5">
          <div>
            Decision making: giving advices about operations is acceptable, but do
            not make decisions for the users;
          </div>
          <div>
            Controlled consequences: users should be granted the freedom to
            operate, including canceling, aborting or terminating current
            operation.
          </div>
        </el-collapse-item>
        <el-collapse-item title="按照电影类别进行查询及统计" name="6">
          <div>
            Decision making: giving advices about operations is acceptable, but do
            not make decisions for the users;
          </div>
          <div>
            Controlled consequences: users should be granted the freedom to
            operate, including canceling, aborting or terminating current
            operation.
          </div>
        </el-collapse-item>
        <el-collapse-item title="按照用户评价进行查询及统计" name="7">
          <div v-for="(content, key) in optionsContent.movieCommentsQueries" :key="key" @click="selectItem(key)"
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
        <el-button :icon="Search" @click="search"></el-button>
      </div>

      <!-- 搜索结果表格 -->
      <el-table :data="searchResults" style="max-height: 300px; overflow-y: auto;">
        <el-table-column prop="title" label="电影名称"></el-table-column>
        <el-table-column prop="director" label="导演"></el-table-column>
        <el-table-column prop="year" label="发行年份"></el-table-column>
      </el-table>

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
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

const activeName = ref('0')

const selectedItem = ref('')
const selectedContent = ref('')

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
  // ... 根据需求继续添加更多选项 ...
  'movieCommentsQueries': {
    '7-1': '1. 用户评分xx分以上的电影有哪些',
    '7-2': '2. 用户评价中有正面评价的电影有哪些',
    '7-3': '3. 用户评价中全是正面评价的电影有哪些',
    '7-4': '4. 用户评价中有差评的电影有哪些',
    '7-5': '5. 好评数最多的电影有哪些',
  },
};

const selectItem = (key) => {
  selectedItem.value = key;
  selectedContent.value = Object.values(optionsContent)
    .flatMap(group => group)
    .find(content => content[key])[key];
};

const searchQuery = ref('');
const searchResults = ref([]);
const drawerVisible = ref(false);

const search = () => {
  // 调用后端接口进行查询
  // 更新 searchResults
  searchResults.value = [{ title: '电影1', director: '导演A', year: '2020' },
  { title: '电影2', director: '导演B', year: '2019' },
  { title: '电影3', director: '导演C', year: '2021' },
  { title: '电影4', director: '导演D', year: '2018' },
  { title: '电影5', director: '导演E', year: '2022' },];
};

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
