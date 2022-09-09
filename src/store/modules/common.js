const common = {
  state: {
    isCollapse: false,
    msgNum: 0,
    term: ''
  },
  mutations: {
    toggleSiderBar(state) {
      state.isCollapse = !state.isCollapse;
    },
     setMsgNum(state, data) {
       state.msgNum = data
    },
     setTerm(state, data) {
       state.term = data
     },
  },
};

export default common;
