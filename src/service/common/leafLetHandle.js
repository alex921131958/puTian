// import {getBounds} from '../../../static/leaflet/js/leaflet-src'
import env from '../../common/env'
import leaflefEvent from '../workflow/leafletEvent'
import MYCONF from "../../myconf";
import Vue from 'vue'
import eventBus from '../../util/event-bus'

export default class LeafLetHandle {
  constructor(_view) {
    this._view = _view;
    this.map = env.leaf_map
  }

  getLinkInfo(projectId){
    let _this = this;
    let mymap = env.leaf_map;
    let my_links= [];
    let target = []; // 目标link数组，即新添加的线段去和target比较是否相交
    // 全局吸附点和吸附监听器
    let snapMarker = L.marker(mymap.getCenter(), {
      icon: mymap.editTools.createVertexIcon({
        className: 'leaflet-div-icon leaflet-drawing-icon'
      }),
      opacity: 1,
      zIndexOffset: 1000,
    });
    let snap_marker = new L.Handler.MarkerSnap(mymap, {
      snapDistance: 15,
      snapVertices: true,
    });
    mapInit();

    function mapInit(){
      for (let i=0; i<my_links.length; i++){
        mymap.removeLayer(my_links[i]);
      }
      my_links = [];
      if (mymap && mymap.getZoom()>13) {
        let bounds = mymap.getBounds();
        let url = `${MYCONF.service.baseRoadLine}?token=${sessionStorage.getItem("token")}&vertexCoorX=${bounds._northEast.lng}&vertexCoorY=${bounds._northEast.lat}&diagonalCoorX=${bounds._southWest.lng}&diagonalCoorY=${bounds._southWest.lat}&projectid=${projectId}`;
        _this._view.$http.get(url).then(response => {
          response = response.body.geoFeatures;
          let links_arr = [];
          let linkAttributes = [];
          response.map(item=>{
            let links = [];
            item.geometry.coordinates.map(coors=>{
              links.push(coors.reverse())
            });
            links_arr.push(links);
            let newArr = item.geoProperties;
            newArr['color']='#708090';
            linkAttributes.push(newArr)
          });
          links_arr.map((item, index)=>{
            let line = L.polyline(item,linkAttributes[index]).addTo(mymap);
            my_links.push(line);
            if (line.options.road_type === 'N' || line.options.road_type==='新建道路') {
              line.setStyle({
                color: _this._view.lineNewColor,
                weight: 8,
              });
            }else if (line.options.road_type === 'C' || line.options.road_type==='改建道路') {
              line.setStyle({
                color: _this._view.lineChangeColor,
                weight: 8,
              });
            }
            if (line.options.road_id === _this._view.curHighlightRoadId) {
              line.setStyle({
                color: '#FF3399'
              });
              _this._view.updateCurHighlightRoadId(null)
            }
            line.on('dragstart', addToTarget);
            line.on('dragend', split);
            line.on('click', lineClick);
          });
        });
      }else {
        eventBus.$emit('zoomWarn')
      }
    }

    // 拖动时把图层添加到对比图层
    function addToTarget(e) {
      e.target.setStyle({
        color: '#FF3399'
      });
      target = [];
      for (let i in mymap._layers) {
        let layer = mymap._layers[i];
        if (layer instanceof L.Polyline && e.target._leaflet_id !== mymap._layers[i]._leaflet_id) {
          target.push(layer)
        }
      }
    }

    // 拖动结束的函数
    function split(e) {
      e.target.setStyle(  {
        color: '#FF3399'
      });
      //
      _this._view.updateCurLinePool(e.target);
      _this._view.updateCurJudgeState('moveline');
      _this._view.updateCurHighlightRoadId(null);
      // splitCross(e.target, 'moveline');
      //todo  ???
      // target = []
    }

    //线的点击函数
    function lineClick(e){
      if (_this._view.curLinePool){
        if(_this._view.curLinePool.options.road_id !== e.target.options.road_id){
          eventBus.$emit('paintWarning')
        }
      }else if (_this._view.curJudgeState === 'oldLine'){  //点击面板上的某条数据的编辑功能
        eventBus.$emit('paintWarning')
      }
      else {
        //当前操作的线段
        _this._view.updateLineInfo(e.target);
        //取消操作存取的线段
        _this._view.updateOriginalLink(e.target);
        //当前操作的line 请求了左侧面板
        _this._view.updateCurLine(e.target.options.road_id);
        _this.refreshLink(e.target.options.road_id);
        _this._view.updateCurLinePool(e.target);
        _this._view.updateCurJudgeState('oldLine');
        _this._view.updateCurHighlightRoadId(null);
        e.sourceTarget.enableEdit();
      }
    }

    // 吸附事件发生后将点加入地图中
    snapMarker.on('snap', function(e) {
      snapMarker.addTo(mymap)
    });
    snapMarker.on('unsnap', function(e) {
      snapMarker.remove()
    });

    mymap.on('moveend', function () {
      mapInit();
    });

    // 开始绘制
    mymap.on('editable:drawing:start', function(e) {
      //禁止拖动地图 防止重新加载
      mymap.dragging.disable();
      snap_marker.watchMarker(snapMarker);
      snap_marker.clearGuideLayers();
      addSnapGuideLayersForMarker(e);
      mymap.on('mousemove', followMouse);
      target = [];
      // 开始绘图时把link填入target中
      for (let i in mymap._layers) {
        let layer = mymap._layers[i];
        if (layer instanceof L.Polyline && e.target._leaflet_id !== mymap._layers[i]._leaflet_id) {
          target.push(layer)
        }
      }
    });

    // 结束绘制
    mymap.on('editable:drawing:end', function(e) {
      mymap.dragging.enable();
      if (e.layer._latlngs[0]) {
        _this._view.updateAttributePanel("road");
        e.layer.setStyle({
          color: '#FF3399'
        });
        // my_links.push(e.layer);
        snap_marker.unwatchMarker(snapMarker);
        snap_marker.clearGuideLayers();
        mymap.off('mousemove', followMouse);
        e.layer.on('dragstart', addToTarget);
        e.layer.on('dragend', split);
        e.layer.on('click', function (e) {
          _this._view.updateLineInfo(e.target);
        });
        // splitCross(e.layer, true); // 进行打断的函数
        _this._view.updateCurLinePool(e.layer);
        _this._view.updateCurJudgeState('newLine');
        _this._view.updateCurHighlightRoadId(null);

        let num = e.layer._leaflet_id - 1;
        // env.bugLines.push(mymap._layers[num])
        env.bugLines.push(num)
      }
    });

    // 在点击后，将终点设置为吸附点的函数
    mymap.on('editable:drawing:click', function(e) {
      let latlng = snapMarker.getLatLng();
      e.latlng.lat = latlng.lat;
      e.latlng.lng = latlng.lng
    });

    // 开始拖动
    mymap.on('editable:vertex:dragstart', function(e) {
      snap_marker.watchMarker(e.vertex);
      snap_marker.clearGuideLayers();
      addSnapGuideLayersForMarker(e);
      target = [];
      for (let i in mymap._layers) {
        if (mymap._layers[i] instanceof L.Polyline && mymap._layers[i]._leaflet_id !== e.layer._leaflet_id) {
          target.push(mymap._layers[i])
        }
      }
    });

    // 结束拖拽
    mymap.on('editable:vertex:dragend', function(e) {
      snap_marker.unwatchMarker(e.vertex);
      snap_marker.clearGuideLayers();
      // splitCross(e.layer, 'dragend');
      _this._view.updateCurLinePool(e.layer);
      _this._view.updateCurJudgeState('dragend');
      _this._view.updateCurHighlightRoadId(null);
      //todo  ???
      // target = []
    });

    function hasLink() {
      for (let i in mymap._layers) {
        if (mymap._layers[i] instanceof L.Polyline) {
          return true
        }
      }
      return false
    }

    // 吸附点跟随鼠标事件
    function followMouse(e) {
      snapMarker.setLatLng(e.latlng)
    }

    // 把图层加入吸附监听器
    function addSnapGuideLayersForMarker(e) {
      if (!hasLink()) {
        return
      }
      for (let i in mymap._layers) {
        if (mymap._layers[i] instanceof L.Polyline && mymap._layers[i]._leaflet_id !== e.layer._leaflet_id) {
          snap_marker.addGuideLayer(mymap._layers[i])
        }
      }
    }

    eventBus.$on("createSuccess", ()=>{
      _this._view.updateCurLinePool(null);
      _this._view.updateCurJudgeState(null);
      mapInit();
    });

    eventBus.$on('cancelChange', function () {
      mapInit()
    });

    eventBus.$on('saveAttributes', function (data) {
      // function splitCross(subject,bool) {
      let subject = _this._view.curLinePool;
      let bool = _this._view.curJudgeState;
      let i;
      let result;
      let result_arr =[];
      let post_arr = {
        splitedLinkUnitList: [],
        createdLinkUnit: [],
        targetOldLink:[],
        subjectOldLink:[]
      };
      let temp = 0;
      let _subject_type = false; // subject是正在操作的link，表示link是否需要打断
      if (target.length && subject) {
        let _subject = ConvertPointArray(subject); // 将link中的所有点进行格式化
        _subject =JSON.parse(JSON.stringify(_subject));
        // 遍历target进行比较
        for (i = 0; i < target.length; i++) {
          let _target = ConvertPointArray(target[i]);  //将target单个元素格式化
          _target =JSON.parse(JSON.stringify(_target));
          result = checkCross(_subject, _target);// 判断是否相交，并接受返回参数
          result =JSON.parse(JSON.stringify(result));
          _subject = result.subject;
          _target = result.target;

          if (result.target_type === 2) {
            //TODO 这里有一个bug 进行吸附端点操作时 会有两个一样的交点 准确来说 中间的交点是cross函数判断普通复制得到的 另一个交点可能是leaflet snap自己添加的 是按引用复制得到的
            let $subject = result.subject;
            let $target = result.target;
            for (let i=0; i<$subject.length; i++){
              for (let j=0; j<$target.length; j++){
                if ($subject[i].latlng.lat === $target[j].latlng.lat){
                  temp += 1
                }
              }
            }
            if (bool==='dragend'){
              if (temp ===1){
                if (result.subject_type === 2){
                  _target[0].node = false;// 此处在重绘是需要用到
                  post_arr.splitedLinkUnitList.push(reCreateLink(target[i], _target));
                  post_arr.targetOldLink.push(target[i]);
                  result_arr.push(result)
                }
              }else {
                _target[0].node = false;// 此处在重绘是需要用到
                post_arr.splitedLinkUnitList.push(reCreateLink(target[i], _target));
                post_arr.targetOldLink.push(target[i]);
                result_arr.push(result)
              }
            }else if(bool!=='dragend'){
              if (temp === 2){

              }else{
                _target[0].node = false;// 此处在重绘是需要用到
                post_arr.splitedLinkUnitList.push(reCreateLink(target[i], _target));
                post_arr.targetOldLink.push(target[i]);
                result_arr.push(result)
              }
            }
          }
          if (result.subject_type) {
            _subject_type = true // 如果操作的link也需要重绘，先在此记号
          }
          if (_subject_type && result.subject_type === 2) {
            _subject[0].node = false;
            post_arr.subjectOldLink.push(subject)
          }
        }
        for (let i=0; i<result_arr.length; i++) {
          let _subject = result_arr[i].subject;
          _subject[0].node = false;
          if (i === result_arr.length-1) {
            post_arr.createdLinkUnit = reCreateLink(subject, _subject);
          }
        }
        //todo 这里是有交点的情况 进行打断和删除操作 拖拽的连接线的中间
        if (result_arr[0]) {
          if (bool === 'moveline') {
            leaflefEvent.deleteLink(subject, _this._view.cur_pro_id);
            leaflefEvent.cutLink(post_arr, _this._view.road_single, data);
          }else if (bool === 'dragend') {
            if (temp === 1){
              //todo 1206修改 需要确认后续
              leaflefEvent.dragendLinkS(post_arr, subject, data)
              // leaflefEvent.cutLink(post_arr, _this._view.road_single, data);
            }else {
              leaflefEvent.dragendLinkS(post_arr, subject, data)
            }
          }else {
            leaflefEvent.cutLink(post_arr, _this._view.road_single, data);
          }
          _this._view.updateCurLinePool(null);
          _this._view.updateCurJudgeState(null);
        }
        //todo 这里是没有交点的情况 进行新增和平移操作 拖拽的连接线的端点
        if (!result_arr[0]){
          if (subject.options.road_id){
            if (bool === 'moveline') {
              leaflefEvent.moveLink(subject, data)
            }else if (bool === 'dragend'){
              leaflefEvent.dragendLinkC(subject, data)
            }else if (bool === 'oldLine') {
              leaflefEvent.updateLink(_this._view.lineOnClick, _this._view.linkOnClick, _this._view.cur_pro_id);
              _this._view.updateCurLinePool(null);
              _this._view.updateCurJudgeState(null);
            }
          }else {
            my_links.push(subject);
            createLink(subject, _this._view.road_single, data);
          }
          _this._view.updateCurLinePool(null);
          _this._view.updateCurJudgeState(null);
        }
      }
      if (_this._view.curJudgeState === 'oldLine'){
        leaflefEvent.updateLink(_this._view.lineOnClick, _this._view.linkOnClick, _this._view.cur_pro_id);
        _this._view.updateCurLinePool(null);
        _this._view.updateCurJudgeState(null);
      }
    });

    function createLink(subject, twinsTag, data) {
      let lineInfo = data[0];
      let linkInfo = data[1];
      let projectId = data[2];
      const lineData = [];
      let temp ;
      for (let i = 0; i < subject._latlngs.length; i++) {
        lineData.push({
          lat: subject._latlngs[i].lat,
          lng: subject._latlngs[i].lng
        })
      }
      const postData = {
        createdLinkInfoList: [{
          id: subject._leaflet_id,
          data: lineData
        }],
        twinsTag: twinsTag,     //是否为单线双向路  0时单线单向 1时单线双向
        buffer_dir: 0,    //0时link方向与画线方向相同 1时与画线方向相反
        roadname: lineInfo.name ? lineInfo.name: '未命名道路',
        editroadtype: lineInfo.linkType==='新建道路'? 'N': lineInfo.linkType==='原有道路'? 'O':lineInfo.linkType==='改建道路'?'C':lineInfo.linkType,
        funcclass: lineInfo.linkLevel==='高速公路' ? '1': lineInfo.linkLevel==='国省道' ? '2': lineInfo.linkLevel==='城市主干路' ? '3':lineInfo.linkLevel==='城市次干路'?'4':'5',
        roadStreamDirInfoList: [{
          capprt:linkInfo.traffic.upper?linkInfo.traffic.upper:0,
          limitspeed:linkInfo.speed.upper?linkInfo.speed.upper:0,
          lanenum: linkInfo.roadWay.upper?linkInfo.roadWay.upper:0
        },{
          capprt:linkInfo.traffic.lower?linkInfo.traffic.lower:0,
          limitspeed:linkInfo.speed.lower?linkInfo.speed.lower:0,
          lanenum: linkInfo.roadWay.lower?linkInfo.roadWay.lower:0
        }]
      };
      let url = `${MYCONF.service.addCreateLink}`;
      Vue.http.post(url+`?projectid=${projectId}&token=${sessionStorage.getItem('token')}`, postData, {
        'header': {
          'Content-Type': "application/json"
        }
      }).then(response => {
        temp = response.body.auxiliaryInformation[0];
        env.lineInfo = response.body.auxiliaryInformation[0];
        eventBus.$emit("createSuccess");
        eventBus.$emit('refreshLineData');
        eventBus.$emit('reGetTableList')
      })
    }

    // 判断交点函数
    function checkCross(_subject, _target) {
      let sub_links = []; // 存储线段
      let tar_links = [];
      let subject = []; // 存储点
      let target = [];
      let i, j;
      let result = {
        subject: [],
        subject_type: 0,
        target: [],
        target_type: 0
      };  // 最后的结果

      for (i = 0; i < _subject.length; i++) {
        let tmp = {
          latlng: L.latLng(_subject[i].latlng.lat, _subject[i].latlng.lng),
          node: _subject[i].node,
        };
        subject.push(tmp)
      } // 将点放入 subject

      for (j = 0; j < _target.length; j++) {
        let tmp = {
          latlng: L.latLng(_target[j].latlng.lat, _target[j].latlng.lng),
          node: _target[j].node
        };
        target.push(tmp)
      } // 将点放入target

      for (i = 0; i < subject.length - 1; i++) {
        let sub_link = [];
        sub_link.push(subject[i]);
        sub_link.push(subject[i + 1]);
        sub_links.push(sub_link)
      } // 将线段放入sub_links
      for (j = 0; j < target.length - 1; j++) {
        let tar_link = [];
        tar_link.push(target[j]);
        tar_link.push(target[j + 1]);
        tar_links.push(tar_link)
      }

      for (i = 0; i < subject.length - 1; i++) {
        for (j = 0; j < target.length - 1; j++) {
          let cross = getInsectionPoint(subject[i], subject[i + 1], target[j], target[j + 1]); // 求交点

          if (cross) {
            let _cross = {
              latlng: {
                lat: cross.lat,
                lng: cross.lng
              },
              node: true
            }; // 记录交点

            // 这里由于在sub_links和tar_links中插入点会改变长度，如果没有下面两句，会导致打断的顺序不对
            let index_tar = getIndexOfArray(cross, tar_links[j]);
            let index_sub = getIndexOfArray(cross, sub_links[i]);

            // 获取交点到线段的距离
            let tar_s_distance = cross.distanceTo(L.latLng(target[j].latlng.lat, target[j].latlng.lng));
            let tar_e_distance = cross.distanceTo(L.latLng(target[j + 1].latlng.lat, target[j + 1].latlng.lng));

            let sub_s_distance = cross.distanceTo(L.latLng(subject[i].latlng.lat, subject[i].latlng.lng));
            let sub_e_distance = cross.distanceTo(L.latLng(subject[i + 1].latlng.lat, subject[i + 1].latlng.lng));
            // 距离太大就证明不在线段上面
            if (tar_e_distance > 0.4 && tar_s_distance > 0.4) {
              tar_links[j].splice(index_tar, 0, _cross); // 将交点插入
              result.target_type = 2 // 证明target需要重绘
            }
            if (sub_e_distance > 0.4 && sub_s_distance > 0.4) {
              sub_links[i].splice(index_sub, 0, _cross);
              result.subject_type = 2
            }
          }
        }
      }

      let tar_result = [];
      let last_link;
      let last_node;
      // 依次将新生成的link的点放入result中
      last_link = tar_links[tar_links.length - 1];
      last_node = last_link[last_link.length - 1];
      for (i = 0; i < tar_links.length; i++) {
        for (j = 0; j < tar_links[i].length - 1; j++) {
          let item = tar_links[i][j];
          // 还会判断相近两点的距离，距离太近则默然为一个点
          if ((tar_result.length === 0) || comparePoint(item, tar_result[tar_result.length - 1])) {
            tar_result.push(item)
          }
        }
      }
      tar_result.push(last_node);

      let sub_result = [];
      last_link = sub_links[sub_links.length - 1];
      last_node = last_link[last_link.length - 1];
      for (i = 0; i < sub_links.length; i++) {
        for (j = 0; j < sub_links[i].length - 1; j++) {
          let item = sub_links[i][j];
          if ((sub_result.length === 0) || comparePoint(item, sub_result[sub_result.length - 1])) {
            sub_result.push(item)
          }
          //sub_result.push(item)
        }
      }
      sub_result.push(last_node);
      result.subject = sub_result;
      result.target = tar_result;
      return result
    }

    // 格式化图层的函数
    function ConvertPointArray(layer) {
      let _latlngs;
      try {
        let latlngs = layer.getLatLngs();
      }catch (e) {
        console.log(e)
      }
      let latlngs = layer.getLatLngs();
      let result = [];
      let i;

      if (latlngs[0] instanceof L.LatLng) {
        _latlngs = latlngs
      } else {
        _latlngs = latlngs[0]
      }

      for (i = 0; i < _latlngs.length; i++) {
        let tmp = {
          latlng: {
            lat: _latlngs[i].lat,
            lng: _latlngs[i].lng
          },
          node: false
        };
        if (i === 0) {
          tmp.node = true
        } else if (i === (_latlngs.length - 1)) {
          tmp.node = true
        }
        result.push(tmp)
      }
      return result
    }

    // 获取焦点的函数
    function getInsectionPoint(a_p1, a_p2, b_p1, b_p2) {
      let a_start = mymap.latLngToLayerPoint(L.latLng(a_p1.latlng.lat, a_p1.latlng.lng));
      let a_end = mymap.latLngToLayerPoint(L.latLng(a_p2.latlng.lat, a_p2.latlng.lng));
      let b_start = mymap.latLngToLayerPoint(L.latLng(b_p1.latlng.lat, b_p1.latlng.lng));
      let b_end = mymap.latLngToLayerPoint(L.latLng(b_p2.latlng.lat, b_p2.latlng.lng));

      // 这里求得是直线的交点
      let cross = math.intersect([a_start.x, a_start.y], [a_end.x, a_end.y], [b_start.x, b_start.y], [b_end.x, b_end.y]);

      console.log(cross)
      if (cross) {
        let crossPt = L.point(cross[0], cross[1]);
        // 如果交点和线段距离太远就证明不在线段上
        if (L.LineUtil.pointToSegmentDistance(crossPt, a_start, a_end) < 1 &&
          L.LineUtil.pointToSegmentDistance(crossPt, b_start, b_end) < 1) {
          return mymap.layerPointToLatLng(crossPt)
        }
      }
      return null
    }

    // 重绘的函数
    function reCreateLink(old_layer, latlngs) {
      let i;
      let new_latlngs = [];
      let new_links;
      let postData = [];
      let ret_link = [];
      latlngs = JSON.parse(JSON.stringify(latlngs));   //todo 做深拷贝 之前此处指向的是内存地址
      for (i = 0; i < latlngs.length; i++) {
        new_latlngs.push(latlngs[i].latlng);
        // 由于第一个点已经变成了false，则只有在线段结束的地方才会运行if内容
        if (latlngs[i].node) {
          new_links = L.polyline(new_latlngs);
          new_links.addTo(mymap);
          ret_link.push(new_links);

          //11.8
          my_links.push(new_links);
          new_links.on('click',function (e) {
            _this._view.updateLineInfo(e.target);
            e.sourceTarget.enableEdit()
          });
          new_links.on('dragstart', addToTarget);
          new_links.on('dragend', split);
          let _distance = 0, _latlngs = new_links.getLatLngs();
          for (let j = 0; j < _latlngs.length - 1; j++) {
            _distance += _latlngs[j].distanceTo(_latlngs[j + 1]);
          }
          //如果重绘的线段太短就直接删去
          _distance = math.round(_distance, 2);
          if (_distance < 1) {
            mymap.removeLayer(new_links);
            new_latlngs.pop();
            continue;
          }
          if (i < latlngs.length - 1) {
            new_latlngs = [];
            new_latlngs.push(latlngs[i].latlng)
          }
          postData.push({
            id: new_links._leaflet_id,
            data:new_links._latlngs,
          });
        }
      }
      mymap.removeLayer(old_layer);
      return ret_link
    }

    // 获取交点位置的函数
    function getIndexOfArray(point, array) {
      let i;
      for (i = 0; i < array.length - 1; i++) {
        let p_p1 = mymap.latLngToLayerPoint(L.latLng(point.lat, point.lng));
        let p_l1 = mymap.latLngToLayerPoint(L.latLng(array[i].latlng.lat, array[i].latlng.lng));
        let p_l2 = mymap.latLngToLayerPoint(L.latLng(array[i + 1].latlng.lat, array[i + 1].latlng.lng));

        if (L.LineUtil.pointToSegmentDistance(p_p1, p_l1, p_l2) <= 1) {
          return i + 1
        }
      }
      return array.length
    }

    // 判断距离的函数
    function comparePoint(p1, p2) {
      let p_p1 = L.latLng(p1.latlng.lat, p1.latlng.lng);
      let p_p2 = L.latLng(p2.latlng.lat, p2.latlng.lng);
      return p_p1.distanceTo(p_p2) >= 0.4;
    }
  }

  //更新VUEX状态
  refreshLink(roadId){
    let _this = this;
    _this._view.updateAttributePanel('road');
    //道路编辑基础属性获取
    let url = `${MYCONF.service.inquireRoadInfo}?linkid_o=${roadId}&projectid=${_this._view.cur_pro_id}&token=${sessionStorage.getItem("token")}`;
    Vue.http.get(url).then(response=> {
      let res = response.body;
      let num = parseFloat(res.length).toFixed(1);
      let line_info = {
        name: res.roadname? res.roadname:'未命名道路',
        linkId: res.linkid_o,           //道路ID
        linkType: res.editroadtype==='N'? '新建道路': res.editroadtype==='O'? '原有道路':res.editroadtype==='C'?'改建道路':res.editroadtype,
        lineId: res.linkagedtazid ? res.linkagedtazid : '--',  //道路连杆
        linkLevel: res.funcclass==='1' ? '高速公路': res.funcclass==='2' ? '国省道': res.funcclass==='3' ? '城市主干路':res.funcclass==='4'?'城市次干路':'城市支路和县乡道',
        linkLen: num,
      };
      let list_length = res.linkPropertiesUnitList.length;
      let line_message = {
        traffic:{
          upper:res.linkPropertiesUnitList[0].capprt,
          lower:res.linkPropertiesUnitList[list_length-1].capprt,
        },
        speed:{
          upper:res.linkPropertiesUnitList[0].limitspeed ? res.linkPropertiesUnitList[0].limitspeed : 30,
          lower:res.linkPropertiesUnitList[list_length-1].limitspeed ? res.linkPropertiesUnitList[list_length-1].limitspeed : 30,
        },
        roadWay:{
          upper:res.linkPropertiesUnitList[0].lanenum,
          lower:res.linkPropertiesUnitList[list_length-1].lanenum,
        },
      }
      _this._view.updateLineOnClick(line_info);
      _this._view.updateLinkOnClick(line_message);
    })
  }

  //加载polygon
  paintPolygon(projectId){
    let mymap = env.leaf_map;
    let _this = this;
    let url = `${MYCONF.service.findLandList}`;
    let coors = [];
    let coors_temp = [];
    Vue.http.get(url+ `token=${sessionStorage.getItem("token")}&projectID=${_this._view.cur_pro_id}`).then((response) => {
      response = response.body;
      if (response.result) {
        for (let i=0; i<response.result.length; i++){
          let temp = response.result[i].points;
          let reverse = [];
          for (let j=0; j<temp.length; j++){
            reverse.push(temp[j].reverse())
          }
          coors.push(reverse)
        }
        for (let i=0; i<coors.length; i++){
          let ploygon = L.polygon(coors[i],{
            color: _this._view.landRoadColor,
            stroke: false
          }).addTo(mymap);
          coors_temp.push(ploygon)
        }
        env.polygonCoors = coors_temp;
      }
    })
  }

  //加载之前操作的Line信息
  getOldLineInfo(projectId){
    eventBus.$emit('removeLinkData');
    let mymap = env.leaf_map;
    let url = `${MYCONF.service.getEditedRoadInfo}`;
    Vue.http.get(url+ `?token=${sessionStorage.getItem("token")}&projectid=${projectId}`).then((res) =>{
      res = res.body;
      let eventData = [];
      for (let i=0; i<res.savedUnitList.length; i++){
        let data1 = {
          linkId: res.savedUnitList[i].linkid_o,
          linkLen: res.savedUnitList[i].length,
          linkLevel: res.savedUnitList[i].funcclass==='1'?'高速公路':res.savedUnitList[i].funcclass==='2'?'国省道':res.savedUnitList[i].funcclass==='3'?'城市主干路':res.savedUnitList[i].funcclass==='4'?'城市次干路':res.savedUnitList[i].funcclass==='5'?'城市支路和县乡道':res.savedUnitList[i].funcclass,
          linkType: res.savedUnitList[i].editroadtype==='改建道路'?res.savedUnitList[i].editroadtype: res.savedUnitList[i].editroadtype==='地块连杆'?res.savedUnitList[i].editroadtype:res.savedUnitList[i].editroadtype==='原有道路'?res.savedUnitList[i].editroadtype:res.savedUnitList[i].editroadtype==='N'?'新建道路':res.savedUnitList[i].editroadtype==='O'?'原有道路':res.savedUnitList[i].editroadtype==='C'?'改建道路':'新建道路',
          name: res.savedUnitList[i].roadname? res.savedUnitList[i].roadname : '未命名道路'
        };
        let data2 = {
          roadWay:{
            lower: res.savedUnitList[i].linkPropertiesUnitList[1].lanenum?res.savedUnitList[i].linkPropertiesUnitList[1].lanenum:0,
            upper: res.savedUnitList[i].linkPropertiesUnitList[0].lanenum?res.savedUnitList[i].linkPropertiesUnitList[0].lanenum:0
          },
          speed: {
            lower: res.savedUnitList[i].linkPropertiesUnitList[1].limitspeed?res.savedUnitList[i].linkPropertiesUnitList[1].limitspeed:0,
            upper: res.savedUnitList[i].linkPropertiesUnitList[0].limitspeed?res.savedUnitList[i].linkPropertiesUnitList[0].limitspeed:0
          },
          traffic: {
            lower: res.savedUnitList[i].linkPropertiesUnitList[1].capprt?res.savedUnitList[i].linkPropertiesUnitList[1].capprt:0,
            upper: res.savedUnitList[i].linkPropertiesUnitList[0].capprt?res.savedUnitList[i].linkPropertiesUnitList[0].capprt:0
          }
        };
        eventData = [data1, data2];
        eventBus.$emit('getOldLineInfoSuccess', eventData)
      }
    })
  }

  //单击道路显示高亮
  highlightLine(newVal, oldVal){
    const mymap = env.leaf_map;
    newVal.setStyle({
      color: '#FF3399'
    });
    if (oldVal){
      let temp = '';
      if (oldVal.options.road_type === '新建道路' || oldVal.options.road_type==='N'){
        temp = this._view.lineNewColor
      } else if (oldVal.options.road_type === '原有道路' || oldVal.options.road_type==='O') {
        temp = '#708090'
      }else if (oldVal.options.road_type === '改建道路' || oldVal.options.road_type==='C') {
        temp = this._view.lineChangeColor
      }
      oldVal.setStyle({
        color: temp
      });
    }
  }

  //去除leaflet水印
  deleteWaterMark(){
    let waterMark = document.getElementsByClassName('leaflet-bottom leaflet-right');
    waterMark[0].style.display = 'none'
  }

  //删除道路
  deleteLink(line){
    const mymap = env.leaf_map;
    mymap.removeLayer(line);
  }

  //开始画线
  startLine() {
    const mymap = env.leaf_map;
    let latlng;
    mymap.editTools.startPolyline(latlng, {
      // renderer: new L.Canvas()
    });

    // mymap.editTools.startPolygon()
  }

  stopLine(){
    const mymap = env.leaf_map;
    mymap.editTools.stopDrawing();
  }

  getLayerContainer(){
    let _this = this;
    const mymap = env.leaf_map;
    mymap.on('moveend', function () {
      let leaf_center = mymap.getCenter();
      let leaf_zoom = mymap.getZoom();
      _this._view.updateMapCenter(leaf_center);
      _this._view.updateMapZoom(leaf_zoom);
    })
  }

  getEditLink(){
    let url = `${MYCONF.service.saveStepTwo}`;
    Vue.http.get(url + `projectid=${this._view.cur_pro_id}&token=${sessionStorage.getItem("token")}`).then((res)=> {
      eventBus.$emit("saveLinkItem");
    })
  }
}
