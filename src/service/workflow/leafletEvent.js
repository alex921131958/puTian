import MYCONF from '../../myconf'
import env from '../../common/env'
import Vue from 'vue'
import eventBus from '../../util/event-bus'

export default class leafletEvent {
  static createLink(subject, twinsTag) {
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
      buffer_dir: 0    //0时link方向与画线方向相同 1时与画线方向相反
    };
    let url = `${MYCONF.service.addCreateLink}`;
    Vue.http.post(url, postData, {
      'header': {
        'Content-Type': "application/json"
      }
    }).then(response => {
      // console.log(response.body.auxiliaryInformation[0])
      // console.log('createLink-success')
      temp = response.body.auxiliaryInformation[0];
      env.lineInfo = response.body.auxiliaryInformation[0];
    })
  }

  static cutLink(post_arr, twinsTag, data) {
    let lineInfo = data[0];
    let linkInfo = data[1];
    let projectId = data[2];
    let split_data = [];
    let create_data = [];
    for (let i = 0; i < post_arr.splitedLinkUnitList.length; i++) {
      let splitedLinkUnitList = post_arr.splitedLinkUnitList[i];
      let splitLink = [];
      for (let j = 0; j < splitedLinkUnitList.length; j++) {
        splitLink.push({
          id: splitedLinkUnitList[j]._leaflet_id,
          data: splitedLinkUnitList[j]._latlngs
        })
      }
      split_data.push({
        splitedPart: splitLink,
        originLink: {
          id: post_arr.targetOldLink[i].options.link_id,
          data: post_arr.targetOldLink[i]._latlngs
        },
        origin_linkid: post_arr.targetOldLink[i].options.link_id,
        origin_linkid_o: post_arr.targetOldLink[i].options.road_id,
        buffer_dir: post_arr.targetOldLink[i].options.buffer_dir,
        source: post_arr.targetOldLink[i].options.source,
        target: post_arr.targetOldLink[i].options.target,
      });
    }
    for (let i = 0; i < post_arr.createdLinkUnit.length; i++) {
      create_data.push({
        id: post_arr.createdLinkUnit[i]._leaflet_id,
        data: post_arr.createdLinkUnit[i]._latlngs
      })
    }
    let postData = {
      splitedLinkUnitList: split_data,
      createdLinkUnit: {
        createdLinkInfoList: create_data,
        twinsTag: twinsTag,
        buffer_dir: 0,
        roadname: lineInfo.name ? lineInfo.name: '未命名道路',
        editroadtype: lineInfo.linkType==='新建道路'? 'N': lineInfo.linkType==='原有道路'? 'C':lineInfo.linkType==='改建道路'?'C':lineInfo.linkType,
        funcclass: lineInfo.linkLevel==='高速公路' ? '1': lineInfo.linkLevel==='国省道' ? '2': lineInfo.linkLevel==='城市主干路' ? '3':lineInfo.linkLevel==='城市次干路'?'4':'5',
        roadStreamDirInfoList: [{
          capprt:linkInfo.traffic.upper,
          limitspeed:linkInfo.speed.upper,
          lanenum: linkInfo.roadWay.upper
        },{
          capprt:linkInfo.traffic.lower,
          limitspeed:linkInfo.speed.lower,
          lanenum: linkInfo.roadWay.lower
        }]
      }
    };
    let url = `${MYCONF.service.splitLink}`;
    Vue.http.post(url+`?projectid=${projectId}&token=${sessionStorage.getItem('token')}`, postData, {
      'header': {
        'Content-Type': "application/json"
      }
    }).then(response => {
      eventBus.$emit("createSuccess");
      eventBus.$emit('reGetTableList')
    })
  }

  static deleteLink(subject, projectid) {
    const postData = {
      originLinkInfo: {
        id: subject._leaflet_id,
        data: subject._latlngs
      },
      origin_linkid: subject.options.link_id,
      origin_linkid_o: subject.options.road_id,
      buffer_dir: subject.options.buffer_dir,
      source: subject.options.source,
      target: subject.options.target,
    };
    let url = `${MYCONF.service.deleteLink}`;
    Vue.http.post(url+`?projectid=${projectid}&token=${sessionStorage.getItem('token')}`, postData, {
      'header': {
        'Content-Type': "application/json"
      }
    }).then(response => {
      eventBus.$emit("createSuccess");
      eventBus.$emit('reGetTableList')
    })
  }

  static moveLink(subject, data) {
    let lineInfo = data[0];
    let linkInfo = data[1];
    let projectId = data[2];
    let latlng = [];
    for (let i=0; i<subject._latlngs.length; i++){
      latlng.push({
        lat: subject._latlngs[i].lat,
        lng:subject._latlngs[i].lng
      })
    }
    const postData = {
      originLinkUnitList: [{
        originLinkInfo: {
          id: subject._leaflet_id,
          data: latlng
        },
        origin_linkid: subject.options.link_id,
        origin_linkid_o: subject.options.road_id,
        buffer_dir: subject.options.buffer_dir,
        source: subject.options.source,
        target: subject.options.target,
      }],
      movedLinkUnit: {
        createdLinkInfoList: [{
          id: subject._leaflet_id,
          data: latlng
        }],
        twinsTag: 0,
        buffer_dir: subject.options.buffer_dir,
        roadname: lineInfo.name ? lineInfo.name: '未命名道路',
        editroadtype: lineInfo.linkType==='新建道路'? 'N': lineInfo.linkType==='原有道路'? 'O':lineInfo.linkType==='改建道路'?'C':lineInfo.linkType,
        funcclass: lineInfo.linkLevel==='高速公路' ? '1': lineInfo.linkLevel==='国省道' ? '2': lineInfo.linkLevel==='城市主干路' ? '3':lineInfo.linkLevel==='城市次干路'?'4':'5',
        roadStreamDirInfoList: [{
          capprt:linkInfo.traffic.upper,
          limitspeed:linkInfo.speed.upper,
          lanenum: linkInfo.roadWay.upper
        },{
          capprt:linkInfo.traffic.lower,
          limitspeed:linkInfo.speed.lower,
          lanenum: linkInfo.roadWay.lower
        }]
      }
    };
    let url = `${MYCONF.service.moveLink}`;
    Vue.http.post(url+`?projectid=${projectId}&token=${sessionStorage.getItem('token')}`, postData, {
      'header': {
        'Content-Type': "application/json"
      }
    }).then(response => {
      eventBus.$emit("createSuccess");
      eventBus.$emit('reGetTableList')
    })
  }

  static dragendLinkC(subject, data){
    let lineInfo = data[0];
    let linkInfo = data[1];
    let projectId = data[2];
    let latlng = [];
    for (let i=0; i<subject._latlngs.length; i++){
      latlng.push({
        lat: subject._latlngs[i].lat,
        lng:subject._latlngs[i].lng
      })
    }
    const postData = {
      originLinkInfoList: [{
        linkid: subject.options.link_id,
        linkid_o: subject.options.road_id,
        buffer_dir: subject.options.buffer_dir,
        source: subject.options.source,
        target: subject.options.target,
      }],
      createdLinkUnit: {
        createdLinkInfoList:[{
          id: subject._leaflet_id,
          data: latlng
        }],
        twinsTag: 0,
        buffer_dir: subject.options.buffer_dir,
        roadname: lineInfo.name ? lineInfo.name: '未命名道路',
        editroadtype: lineInfo.linkType==='新建道路'? 'N': lineInfo.linkType==='原有道路'? 'O':lineInfo.linkType==='改建道路'?'C':lineInfo.linkType,
        funcclass: lineInfo.linkLevel==='高速公路' ? '1': lineInfo.linkLevel==='国省道' ? '2': lineInfo.linkLevel==='城市主干路' ? '3':lineInfo.linkLevel==='城市次干路'?'4':'5',
        roadStreamDirInfoList: [{
          capprt:linkInfo.traffic.upper,
          limitspeed:linkInfo.speed.upper,
          lanenum: linkInfo.roadWay.upper
        },{
          capprt:linkInfo.traffic.lower,
          limitspeed:linkInfo.speed.lower,
          lanenum: linkInfo.roadWay.lower
        }]
      },
    };
    let url = `${MYCONF.service.dragLink_c}`;
    Vue.http.post(url+`?projectid=${projectId}&token=${sessionStorage.getItem('token')}`, postData, {
      'header': {
        'Content-Type': "application/json"
      }
    }).then(response => {
      eventBus.$emit("createSuccess");
      eventBus.$emit('reGetTableList')
    })
  }

  static dragendLinkS(post_arr, subject, data){
    let lineInfo = data[0];
    let linkInfo = data[1];
    let projectId = data[2];
    let split_data = [];
    let create_data = [];
    for (let i = 0; i < post_arr.splitedLinkUnitList.length; i++) {
      let splitedLinkUnitList = post_arr.splitedLinkUnitList[i];
      let splitLink = [];
      for (let j = 0; j < splitedLinkUnitList.length; j++) {
        splitLink.push({
          id: splitedLinkUnitList[j]._leaflet_id,
          data: splitedLinkUnitList[j]._latlngs
        })
      }
      split_data.push({
        splitedPart: splitLink,
        originLink: {
          id: post_arr.targetOldLink[i].options.link_id,
          data: post_arr.targetOldLink[i]._latlngs
        },
        origin_linkid: post_arr.targetOldLink[i].options.link_id,
        origin_linkid_o: post_arr.targetOldLink[i].options.road_id,
        buffer_dir: post_arr.targetOldLink[i].options.buffer_dir,
        source: post_arr.targetOldLink[i].options.source,
        target: post_arr.targetOldLink[i].options.target,
      });
    }
    for (let i = 0; i < post_arr.createdLinkUnit.length; i++) {
      create_data.push({
        id: post_arr.createdLinkUnit[i]._leaflet_id,
        data: post_arr.createdLinkUnit[i]._latlngs
      })
    }

    let latlng = [];
    for (let i=0; i<subject._latlngs.length; i++){
      latlng.push({
        lat: subject._latlngs[i].lat,
        lng:subject._latlngs[i].lng
      })
    }
    const postData = {
      originLinkInfoList: [{
        originLinkInfo: {
          id: subject._leaflet_id,
          data: latlng
        },
        linkid: subject.options.link_id,
        linkid_o: subject.options.road_id,
        buffer_dir: subject.options.buffer_dir,
        source: subject.options.source,
        target: subject.options.target,
      }],
      splitedLinkInfo:{
        splitedLinkUnitList: split_data,
        createdLinkUnit: {
          createdLinkInfoList: create_data,
          twinsTag: 0,
          buffer_dir: subject.options.buffer_dir,
          roadname: lineInfo.name ? lineInfo.name: '未命名道路',
          editroadtype: lineInfo.linkType==='新建道路'? 'N': lineInfo.linkType==='原有道路'? 'O':lineInfo.linkType==='改建道路'?'C':lineInfo.linkType,
          funcclass: lineInfo.linkLevel==='高速公路' ? '1': lineInfo.linkLevel==='国省道' ? '2': lineInfo.linkLevel==='城市主干路' ? '3':lineInfo.linkLevel==='城市次干路'?'4':'5',
          roadStreamDirInfoList: [{
            capprt:linkInfo.traffic.upper,
            limitspeed:linkInfo.speed.upper,
            lanenum: linkInfo.roadWay.upper
          },{
            capprt:linkInfo.traffic.lower,
            limitspeed:linkInfo.speed.lower,
            lanenum: linkInfo.roadWay.lower
          }]
        }
      }
    };

    let url = `${MYCONF.service.dragLink_s}`;
    Vue.http.post(url+`?projectid=${projectId}&token=${sessionStorage.getItem('token')}`, postData, {
      'header': {
        'Content-Type': "application/json"
      }
    }).then(response => {
      eventBus.$emit("createSuccess");
      eventBus.$emit('reGetTableList')
    })
  }

  static updateLink(lineData, linkData, projectid) {
    let postData = {
      roadname: lineData.name,          //道路名称
      linkid_o: lineData.linkId,         //道路ID
      editroadtype: lineData.linkType,   //道路类型
      linkagedtazid: lineData.lineId,    //连杆链接地块ID
      funcclass: lineData.linkLevel==='高速公路'?1:lineData.linkLevel==='国省道'?2:lineData.linkLevel==='城市主干路'?3:lineData.linkLevel==='城市次干路'?4:5,
      length: lineData.linkLen,
      linkPropertiesUnitList: [{
        capprt:linkData.traffic.upper,
        limitspeed:linkData.speed.upper,
        lanenum:linkData.roadWay.upper,
      },{
        capprt:linkData.traffic.lower,
        limitspeed:linkData.speed.lower,
        lanenum:linkData.roadWay.lower,
      }]
    };
    let url = `${MYCONF.service.updateLink}`;
    Vue.http.post(url+`?projectid=${projectid}&token=${sessionStorage.getItem('token')}`, postData, {
      'header': {
        'Content-Type': "application/json"
      }
    }).then(response => {
      if(response.body.responseMsg==='Please check these parameter:capprt/limitspeed/lane'){
        eventBus.$emit('updateWarn')
      }
      env.changeLine = true;
      eventBus.$emit('refreshLineData');
      eventBus.$emit("createSuccess");
      eventBus.$emit("saveEditLinks");
      eventBus.$emit('reGetTableList')
    })
  }


}
