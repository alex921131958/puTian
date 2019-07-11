import MYCONF from '../myconf'
export default {
  state: {
    car_traffic_1: MYCONF.CAR_TRAFFIC_2,
    car_traffic_2: MYCONF.CAR_TRAFFIC_2,
    car_traffic_3: MYCONF.CAR_TRAFFIC_3,
    car_traffic_4: MYCONF.CAR_TRAFFIC_4_BASE,
    car_traffic_5: MYCONF.CAR_TRAFFIC_5,
    car_traffic_6: MYCONF.CAR_TRAFFIC_6,

    cmn_traffic_1: MYCONF.CAR_TRAFFIC_2,
    cmn_traffic_3: MYCONF.CAR_TRAFFIC_3,


    person_trip_1:MYCONF.PERSONTRIP_1,
    person_trip_2:MYCONF.PERSONTRIP_2,
    person_trip_3:MYCONF.PERSONTRIP_3,
    person_trip_4:MYCONF.PERSONTRIP_4,
    person_trip_5:MYCONF.PERSONTRIP_5,
  },

  getters: {
    car_traffic_1: state => state.car_traffic_1,
    car_traffic_2: state => state.car_traffic_2,
    car_traffic_3: state => state.car_traffic_3,
    car_traffic_4: state => state.car_traffic_4,
    car_traffic_5: state => state.car_traffic_5,
    car_traffic_6: state => state.car_traffic_6,

    cmn_traffic_1: state => state.cmn_traffic_1,
    cmn_traffic_3: state => state.cmn_traffic_3,

    person_trip_1: state => state.person_trip_1,
    person_trip_2: state => state.person_trip_2,
    person_trip_3: state => state.person_trip_3,
    person_trip_4: state => state.person_trip_4,
    person_trip_5: state => state.person_trip_5,
  },

  mutations: {
    updateCarTraffic1(state, payload){
      state.car_traffic_1 = Object.assign({},state.car_traffic_1,payload);
    },
    updateCarTraffic2(state, payload){
      state.car_traffic_2 = Object.assign({},state.car_traffic_2,payload);
    },
    updateCarTraffic3(state, payload){
      state.car_traffic_3 = Object.assign({},state.car_traffic_3,payload);
    },
    updateCarTraffic4(state, payload){
      state.car_traffic_4 = Object.assign({},state.car_traffic_4,payload);
    },
    updateCarTraffic5(state, payload){
      state.car_traffic_5 = Object.assign({},state.car_traffic_5,payload);
    },
    updateCarTraffic6(state, payload){
      state.car_traffic_6 = Object.assign({},state.car_traffic_6,payload);
    },

    updateCmnTraffic1(state, payload){
      state.cmn_traffic_1 = Object.assign({},state.cmn_traffic_1,payload);
    },
    updateCmnTraffic3(state, payload){
      state.cmn_traffic_3 = Object.assign({},state.cmn_traffic_3,payload);
    },

    updatePersonTrip1(state, payload){
      state.person_trip_1 = Object.assign({},state.person_trip_1,payload);
    },
    updatePersonTrip2(state, payload){
      state.person_trip_2 = Object.assign({},state.person_trip_2,payload);
    },
    updatePersonTrip3(state, payload){
      state.person_trip_3 = Object.assign({},state.person_trip_3,payload);
    },
    updatePersonTrip4(state, payload){
      state.person_trip_4 = Object.assign({},state.person_trip_4,payload);
    },
    updatePersonTrip5(state, payload){
      state.person_trip_5 = Object.assign({},state.person_trip_5,payload);
    },
  },

}
