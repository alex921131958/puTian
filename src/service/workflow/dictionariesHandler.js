import Vue from 'vue'
import MYCONF from '../../myconf'
import env from '../../common/env'

export default class dictionariesHandler {
  static dicHandler(data){
    let url = MYCONF.service.saveSubDict + `token=${sessionStorage.getItem("token")}`;
    Vue.http.post(url, {

    }).then(res=> {

    })
  }
}
