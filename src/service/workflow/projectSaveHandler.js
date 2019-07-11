/**
 * Created by limei on 2018/6/12.
 */
import MYCONF from '../../myconf'
import env from '../../common/env'
import eventBus from "../../util/event-bus";

export default class projectSaveHandler {
  constructor(_view) {
    this._view = _view;
  }

  saveProjectFun(type) {
    let curType = this._view.cur_pro_type;
    let curName = this._view.cur_project.name;
    let curId = this._view.pro_count>0?this._view.cur_pro_id:null;
    let url = MYCONF.service.saveProject + `token=${sessionStorage.getItem("token")}&editType=${type}`;
    if(!this._view.loading_tip){
      let loadingTip = this._view.$Message.loading({
        content:'正在进行跳转页面配置，请稍等...',
        duration:0
      });
      this._view.updateLoadingTip(loadingTip);
    }
    this._view.$http.post(url, {
        id:curId,
        type: curType,
        name:curName,
      },
      {
        'header': {
          'Content-Type': "application/json"
        }
      }).then((res) => {
      res = res.body;
      if(res.success){
        let data = res.result;
        sessionStorage.setItem("projectid", data.id);
        this._view.updateCurProId(data.id);
        this._view.updateCurProType(data.type);
        if(type === 'replace'){
          this._view.updateCurProject(data);
        }else{
          this._view.updateCurProject({id:data.id});
        }
        this._view.$router.push({path: '/workflow'});
        this._view.updateCurRoute('workflow');
        this._view.updateCurStep(1);
      }else{
        if(this._view.loading_tip) setTimeout(this._view.loading_tip,0);
        this._view.updateLoadingTip(null);
        if(type === 'replace'){
          this._view.$Message.warning({
            content: '项目替换失败',
            duration:5,
            closable: true
          });
        }
      }
    });
  }

}
