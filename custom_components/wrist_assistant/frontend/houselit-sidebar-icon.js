// The transparent seam gives the small Eave Fold mark its shape in any theme.
window.customIcons = window.customIcons || {};
window.customIcons.houselit = {
  getIcon: function (name) {
    var path = name === "eave-fold"
      ? "M2.5,8.8 L8.5,4 L21.5,8.5 L21.5,11.5 L8.7,7 L2.5,12.1 Z " +
        "M2.9,14.2 L7.6,10.2 L7.6,20 L3.4,20 Q2.9,20 2.9,19.5 Z " +
        "M9.6,9.5 L21.1,13.6 L21.1,19.5 Q21.1,20 20.6,20 L9.6,20 Z"
      : "";
    return Promise.resolve({ path: path });
  },
};
