<template>
  <div id="app">
        <!-- 头部 -->
        <Header></Header>
        <!-- 中间部分 -->
        <div class="content-part">
            <router-view></router-view>
        </div>
        <!-- 底部内容 -->
        <Footer></Footer>
  </div>
</template>

<script>
    import Header from './components/Header';
    import Footer from './components/Footer';

    export default {
      name: 'App',
      components: {
          Header,
          Footer
      },
      methods:{}
    }
</script>

<style>

    .title {
      font-size: 24px;
      font-weight: 600px;
    }

    .content-part {
      background: white;
      padding: 20px;
      width: 1024px;
      margin: 30px auto 0;
      /*text-align: center;*/
    }


    body {
      background: #f2f2f2;
      padding: 0;
      margin: 0;
    }


</style>
