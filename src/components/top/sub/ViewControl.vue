<template>
  <div id="box">
    <ul>
      <li v-for="(item,index) in map_view">
        <span>图幅 {{index+1}}</span>
        <div class="item">
          <div class="img">
            <img :src="item.imgUrl" alt="" @click="locateToMap(item,index)">
          </div>
          <div class="btnDiv">
            <span :class="{active:mapBtn==='confirm'}" @click="locateToMap(item,index)">读取</span>
            <span :class="{active:mapBtn==='cancel'}" @click="getMapLocation(item,index)">更新</span>
          </div>
        </div>
      </li>
    </ul>
    <!--<p class="btn">-->
    <!--<span :class="['btn',curBtn==='confirm'?'active':'']" @click="updateCurTab('')">确  认</span>-->
    <!--<span :class="['btn',curBtn==='cancel'?'active':'']" @click="updateCurTab('')">取  消</span>-->
    <!--</p>-->
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import env from '../../../common/env'
  import MYCONF from '../../../myconf'
  import datetimeHelper from "../../../util/datetime-helper";

  export default {
    name: "ViewControl",
    data() {
      return {
        curBtn: 'confirm',
        mapBtn: 'confirm',
        // mapList:MYCONF.MAP_VIEW_DEFAULT,
      }
    },
    computed: {
      ...mapGetters(['cur_tab', 'map_view']),
    },
    methods: {
      ...mapMutations(['updateCurTab', 'updateMapView']),
      getMapLocation(item, index) {
        let center = env.map.getCenter();
        let zoom = env.map.getZoom();
        let mapView = this.map_view;
        mapView[index].center = center;
        mapView[index].zoom = zoom;
        this.updateMapView(mapView);
        this.saveImage(index);
      },
      saveImage(count) {
        let c = env.map.getCanvas();
        let img_data = Canvas2Image.saveAsJPEG(c, true).getAttribute('src');
        this.upLoadImage(img_data, count);
        // datetimeHelper.saveFile(img_data, `图幅${count}.jpg`);
        let mapView = this.map_view;
        mapView[count].imgUrl = img_data;
      },
      upLoadImage(img_data, count) {
        let center = env.map.getCenter();
        let zoom = env.map.getZoom();
        let _this = this;
        this.$http.post(MYCONF.service.saveSettings+`?token=${sessionStorage.getItem('token')}`, {
          menuid:`map_view${count+1}`,
          keys:'count,imgUrl,center,zoom',
          values:`${count},${img_data.split(',')[1]},${center.lng}&${center.lat},${zoom}`,
        }, {emulateJSON: true}).then(response => {
          response= response.body;
          if(response.success){
            _this.$Message.success({
              content: `图幅${count}更新成功`,
              duration: 2,
              closable: true
            });
          }
        }, response => {
          _this.$Message.success({
            content: '更新失败，请重试',
            closable: true
          });
        });
      },
      locateToMap(item, index) {
        env.map.flyTo({
          center: this.map_view[index].center,
          zoom: this.map_view[index].zoom,
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../../../common/common.scss";

  #box {
    position: absolute;
    top: 4em;
    right: 0;
    width: 24em;
    height: 21em;
    background-color: #555;
    z-index: 500;
    padding: 0.2em 0.5em 1em 1.5em;
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 10em;
        display: flex;
        flex-direction: column;
        margin-right: 1em;
        margin-top: 1em;
        & > span {
          height: 2em;
          line-height: 2em;
          text-align: left;
        }
        & > .item {
          flex: 1;
          display: flex;
          .img {
            width: 6em;
            height: 6em;
            margin-right: 0.8em;
            text-align: center;
            overflow: hidden;
            img{
              height: 6em;
              margin: 0 50%;
              transform: translateX(-50%);
            }
          }
          .btnDiv {
            flex: 1;
            span {
              display: block;
              border-radius: 18px;
              background-color: #adadad;
              height: 2.2em;
              line-height: 2.2em;
              margin-top: 0.5em;
              margin-bottom: 0.5em;
              transition: all ease-in-out 0.3s;
              &.active, &:hover {
                background-color: $bg-red;
                transition: all ease-in-out 0.3s;
              }
            }
          }
        }
      }
    }
    p.btn {
      display: flex;
      justify-content: flex-end;
      margin-right: 1.5em;
      span.btn {
        width: 8em;
        margin-left: 1em;
        height: 3em;
        line-height: 3em;
        margin-top: 1.5em;
        background-color: #adadad;
        transition: all ease-in-out 0.3s;
        &.active, &:hover {
          background-color: $bg-red;
          transition: all ease-in-out 0.3s;
        }
      }
    }
  }

</style>
