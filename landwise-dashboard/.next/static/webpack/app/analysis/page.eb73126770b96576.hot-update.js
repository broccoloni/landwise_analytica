"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/analysis/page",{

/***/ "(app-pages-browser)/./components/Trends.tsx":
/*!*******************************!*\
  !*** ./components/Trends.tsx ***!
  \*******************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ Trends; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react_plotly_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-plotly.js */ \"(app-pages-browser)/./node_modules/react-plotly.js/react-plotly.js\");\n/* harmony import */ var papaparse__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! papaparse */ \"(app-pages-browser)/./node_modules/papaparse/papaparse.min.js\");\n/* harmony import */ var papaparse__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(papaparse__WEBPACK_IMPORTED_MODULE_3__);\n\nvar _s = $RefreshSig$();\n\n\n\nfunction Trends() {\n    _s();\n    const [selectedCrop, setSelectedCrop] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(\"Flaxseed\");\n    const [data, setData] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);\n    const crops = [\n        \"Flaxseed\",\n        \"Wheat\",\n        \"Barley\",\n        \"Oats\",\n        \"Canola\",\n        \"Peas\",\n        \"Corn\",\n        \"Soy\"\n    ];\n    // Fetch CSV data directly from public folder\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        const fetchData = async ()=>{\n            const response = await fetch(\"/demo/trends/crop_yield_per_year.csv\");\n            const csv = await response.text();\n            const parsed = papaparse__WEBPACK_IMPORTED_MODULE_3___default().parse(csv, {\n                header: true,\n                dynamicTyping: true\n            });\n            setData(parsed.data);\n        };\n        fetchData();\n    }, []);\n    // Filter data based on selected crop and years\n    const filteredData = data.filter((item)=>item.Crop === selectedCrop && item.Year >= 2014 && item.Year <= 2034).filter((item)=>[\n            \"Property\",\n            \"Neighbourhood\",\n            \"National\"\n        ].includes(item.levels));\n    // Prepare data for Plotly\n    const plotData = filteredData.reduce((acc, item)=>{\n        const levelIndex = acc.findIndex((series)=>series.name === item.levels);\n        if (levelIndex !== -1) {\n            acc[levelIndex].x.push(item.Year);\n            acc[levelIndex].y.push(item.Yield);\n        } else {\n            acc.push({\n                x: [\n                    item.Year\n                ],\n                y: [\n                    item.Yield\n                ],\n                name: item.levels,\n                mode: \"lines\"\n            });\n        }\n        return acc;\n    }, []);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                style: {\n                    display: \"flex\",\n                    justifyContent: \"space-between\"\n                },\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h1\", {\n                        children: \"Trends\"\n                    }, void 0, false, {\n                        fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/Trends.tsx\",\n                        lineNumber: 47,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"select\", {\n                        value: selectedCrop,\n                        onChange: (e)=>setSelectedCrop(e.target.value),\n                        children: crops.map((crop)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"option\", {\n                                value: crop,\n                                children: crop\n                            }, crop, false, {\n                                fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/Trends.tsx\",\n                                lineNumber: 53,\n                                columnNumber: 13\n                            }, this))\n                    }, void 0, false, {\n                        fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/Trends.tsx\",\n                        lineNumber: 48,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/Trends.tsx\",\n                lineNumber: 46,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h2\", {\n                children: [\n                    \"Estimated Historic & Projected Land Suitability: \",\n                    selectedCrop\n                ]\n            }, void 0, true, {\n                fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/Trends.tsx\",\n                lineNumber: 60,\n                columnNumber: 7\n            }, this),\n            plotData.length > 0 ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_plotly_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n                data: plotData,\n                layout: {\n                    title: \"Estimated Land Suitability (Bushels/Acre)\",\n                    xaxis: {\n                        title: \"Year\"\n                    },\n                    yaxis: {\n                        title: \"Yield\"\n                    },\n                    shapes: [\n                        {\n                            type: \"line\",\n                            x0: 2024,\n                            x1: 2024,\n                            y0: 0,\n                            y1: 1,\n                            xref: \"x\",\n                            yref: \"paper\",\n                            line: {\n                                color: \"grey\",\n                                dash: \"dash\"\n                            },\n                            annotation: {\n                                text: \"2024\"\n                            }\n                        }\n                    ]\n                }\n            }, void 0, false, {\n                fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/Trends.tsx\",\n                lineNumber: 63,\n                columnNumber: 9\n            }, this) : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                children: \"Loading data...\"\n            }, void 0, false, {\n                fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/Trends.tsx\",\n                lineNumber: 85,\n                columnNumber: 9\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/Trends.tsx\",\n        lineNumber: 45,\n        columnNumber: 5\n    }, this);\n}\n_s(Trends, \"EV3AXmZQbZ3y5OLpavXxbyhPpy4=\");\n_c = Trends;\nvar _c;\n$RefreshReg$(_c, \"Trends\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2NvbXBvbmVudHMvVHJlbmRzLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBNEM7QUFDVDtBQUNOO0FBRWQsU0FBU0k7O0lBQ3RCLE1BQU0sQ0FBQ0MsY0FBY0MsZ0JBQWdCLEdBQUdOLCtDQUFRQSxDQUFDO0lBQ2pELE1BQU0sQ0FBQ08sTUFBTUMsUUFBUSxHQUFHUiwrQ0FBUUEsQ0FBQyxFQUFFO0lBQ25DLE1BQU1TLFFBQVE7UUFBQztRQUFZO1FBQVM7UUFBVTtRQUFRO1FBQVU7UUFBUTtRQUFRO0tBQU07SUFFdEYsNkNBQTZDO0lBQzdDUixnREFBU0EsQ0FBQztRQUNSLE1BQU1TLFlBQVk7WUFDaEIsTUFBTUMsV0FBVyxNQUFNQyxNQUFNO1lBQzdCLE1BQU1DLE1BQU0sTUFBTUYsU0FBU0csSUFBSTtZQUMvQixNQUFNQyxTQUFTWixzREFBVSxDQUFDVSxLQUFLO2dCQUFFSSxRQUFRO2dCQUFNQyxlQUFlO1lBQUs7WUFDbkVWLFFBQVFPLE9BQU9SLElBQUk7UUFDckI7UUFFQUc7SUFDRixHQUFHLEVBQUU7SUFFTCwrQ0FBK0M7SUFDL0MsTUFBTVMsZUFBZVosS0FDbEJhLE1BQU0sQ0FBQyxDQUFDQyxPQUFTQSxLQUFLQyxJQUFJLEtBQUtqQixnQkFBZ0JnQixLQUFLRSxJQUFJLElBQUksUUFBUUYsS0FBS0UsSUFBSSxJQUFJLE1BQ2pGSCxNQUFNLENBQUMsQ0FBQ0MsT0FBUztZQUFDO1lBQVk7WUFBaUI7U0FBVyxDQUFDRyxRQUFRLENBQUNILEtBQUtJLE1BQU07SUFFbEYsMEJBQTBCO0lBQzFCLE1BQU1DLFdBQVdQLGFBQWFRLE1BQU0sQ0FBQyxDQUFDQyxLQUFLUDtRQUN6QyxNQUFNUSxhQUFhRCxJQUFJRSxTQUFTLENBQUMsQ0FBQ0MsU0FBV0EsT0FBT0MsSUFBSSxLQUFLWCxLQUFLSSxNQUFNO1FBQ3hFLElBQUlJLGVBQWUsQ0FBQyxHQUFHO1lBQ3JCRCxHQUFHLENBQUNDLFdBQVcsQ0FBQ0ksQ0FBQyxDQUFDQyxJQUFJLENBQUNiLEtBQUtFLElBQUk7WUFDaENLLEdBQUcsQ0FBQ0MsV0FBVyxDQUFDTSxDQUFDLENBQUNELElBQUksQ0FBQ2IsS0FBS2UsS0FBSztRQUNuQyxPQUFPO1lBQ0xSLElBQUlNLElBQUksQ0FBQztnQkFDUEQsR0FBRztvQkFBQ1osS0FBS0UsSUFBSTtpQkFBQztnQkFDZFksR0FBRztvQkFBQ2QsS0FBS2UsS0FBSztpQkFBQztnQkFDZkosTUFBTVgsS0FBS0ksTUFBTTtnQkFDakJZLE1BQU07WUFDUjtRQUNGO1FBQ0EsT0FBT1Q7SUFDVCxHQUFHLEVBQUU7SUFFTCxxQkFDRSw4REFBQ1U7OzBCQUNDLDhEQUFDQTtnQkFBSUMsT0FBTztvQkFBRUMsU0FBUztvQkFBUUMsZ0JBQWdCO2dCQUFnQjs7a0NBQzdELDhEQUFDQztrQ0FBRzs7Ozs7O2tDQUNKLDhEQUFDQzt3QkFDQ0MsT0FBT3ZDO3dCQUNQd0MsVUFBVSxDQUFDQyxJQUFNeEMsZ0JBQWdCd0MsRUFBRUMsTUFBTSxDQUFDSCxLQUFLO2tDQUU5Q25DLE1BQU11QyxHQUFHLENBQUMsQ0FBQ0MscUJBQ1YsOERBQUNDO2dDQUFrQk4sT0FBT0s7MENBQ3ZCQTsrQkFEVUE7Ozs7Ozs7Ozs7Ozs7Ozs7MEJBT25CLDhEQUFDRTs7b0JBQUc7b0JBQWtEOUM7Ozs7Ozs7WUFFckRxQixTQUFTMEIsTUFBTSxHQUFHLGtCQUNqQiw4REFBQ2xELHVEQUFJQTtnQkFDSEssTUFBTW1CO2dCQUNOMkIsUUFBUTtvQkFDTkMsT0FBUTtvQkFDUkMsT0FBTzt3QkFBRUQsT0FBTztvQkFBTztvQkFDdkJFLE9BQU87d0JBQUVGLE9BQU87b0JBQVE7b0JBQ3hCRyxRQUFRO3dCQUNOOzRCQUNFQyxNQUFNOzRCQUNOQyxJQUFJOzRCQUNKQyxJQUFJOzRCQUNKQyxJQUFJOzRCQUNKQyxJQUFJOzRCQUNKQyxNQUFNOzRCQUNOQyxNQUFNOzRCQUNOQyxNQUFNO2dDQUFFQyxPQUFPO2dDQUFRQyxNQUFNOzRCQUFPOzRCQUNwQ0MsWUFBWTtnQ0FBRXRELE1BQU07NEJBQU87d0JBQzdCO3FCQUNEO2dCQUNIOzs7OztxQ0FHRiw4REFBQ3VEOzBCQUFFOzs7Ozs7Ozs7Ozs7QUFJWDtHQXBGd0JqRTtLQUFBQSIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9jb21wb25lbnRzL1RyZW5kcy50c3g/MDQyNiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgUGxvdCBmcm9tIFwicmVhY3QtcGxvdGx5LmpzXCI7XG5pbXBvcnQgUGFwYSBmcm9tIFwicGFwYXBhcnNlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFRyZW5kcygpIHtcbiAgY29uc3QgW3NlbGVjdGVkQ3JvcCwgc2V0U2VsZWN0ZWRDcm9wXSA9IHVzZVN0YXRlKFwiRmxheHNlZWRcIik7XG4gIGNvbnN0IFtkYXRhLCBzZXREYXRhXSA9IHVzZVN0YXRlKFtdKTtcbiAgY29uc3QgY3JvcHMgPSBbXCJGbGF4c2VlZFwiLCBcIldoZWF0XCIsIFwiQmFybGV5XCIsIFwiT2F0c1wiLCBcIkNhbm9sYVwiLCBcIlBlYXNcIiwgXCJDb3JuXCIsIFwiU295XCJdO1xuXG4gIC8vIEZldGNoIENTViBkYXRhIGRpcmVjdGx5IGZyb20gcHVibGljIGZvbGRlclxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGZldGNoRGF0YSA9IGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCIvZGVtby90cmVuZHMvY3JvcF95aWVsZF9wZXJfeWVhci5jc3ZcIik7XG4gICAgICBjb25zdCBjc3YgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG4gICAgICBjb25zdCBwYXJzZWQgPSBQYXBhLnBhcnNlKGNzdiwgeyBoZWFkZXI6IHRydWUsIGR5bmFtaWNUeXBpbmc6IHRydWUgfSk7XG4gICAgICBzZXREYXRhKHBhcnNlZC5kYXRhKTtcbiAgICB9O1xuXG4gICAgZmV0Y2hEYXRhKCk7XG4gIH0sIFtdKTtcblxuICAvLyBGaWx0ZXIgZGF0YSBiYXNlZCBvbiBzZWxlY3RlZCBjcm9wIGFuZCB5ZWFyc1xuICBjb25zdCBmaWx0ZXJlZERhdGEgPSBkYXRhXG4gICAgLmZpbHRlcigoaXRlbSkgPT4gaXRlbS5Dcm9wID09PSBzZWxlY3RlZENyb3AgJiYgaXRlbS5ZZWFyID49IDIwMTQgJiYgaXRlbS5ZZWFyIDw9IDIwMzQpXG4gICAgLmZpbHRlcigoaXRlbSkgPT4gW1wiUHJvcGVydHlcIiwgXCJOZWlnaGJvdXJob29kXCIsIFwiTmF0aW9uYWxcIl0uaW5jbHVkZXMoaXRlbS5sZXZlbHMpKTtcblxuICAvLyBQcmVwYXJlIGRhdGEgZm9yIFBsb3RseVxuICBjb25zdCBwbG90RGF0YSA9IGZpbHRlcmVkRGF0YS5yZWR1Y2UoKGFjYywgaXRlbSkgPT4ge1xuICAgIGNvbnN0IGxldmVsSW5kZXggPSBhY2MuZmluZEluZGV4KChzZXJpZXMpID0+IHNlcmllcy5uYW1lID09PSBpdGVtLmxldmVscyk7XG4gICAgaWYgKGxldmVsSW5kZXggIT09IC0xKSB7XG4gICAgICBhY2NbbGV2ZWxJbmRleF0ueC5wdXNoKGl0ZW0uWWVhcik7XG4gICAgICBhY2NbbGV2ZWxJbmRleF0ueS5wdXNoKGl0ZW0uWWllbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhY2MucHVzaCh7XG4gICAgICAgIHg6IFtpdGVtLlllYXJdLFxuICAgICAgICB5OiBbaXRlbS5ZaWVsZF0sXG4gICAgICAgIG5hbWU6IGl0ZW0ubGV2ZWxzLFxuICAgICAgICBtb2RlOiBcImxpbmVzXCIsXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGFjYztcbiAgfSwgW10pO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJmbGV4XCIsIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIiB9fT5cbiAgICAgICAgPGgxPlRyZW5kczwvaDE+XG4gICAgICAgIDxzZWxlY3RcbiAgICAgICAgICB2YWx1ZT17c2VsZWN0ZWRDcm9wfVxuICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0U2VsZWN0ZWRDcm9wKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgPlxuICAgICAgICAgIHtjcm9wcy5tYXAoKGNyb3ApID0+IChcbiAgICAgICAgICAgIDxvcHRpb24ga2V5PXtjcm9wfSB2YWx1ZT17Y3JvcH0+XG4gICAgICAgICAgICAgIHtjcm9wfVxuICAgICAgICAgICAgPC9vcHRpb24+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvc2VsZWN0PlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxoMj5Fc3RpbWF0ZWQgSGlzdG9yaWMgJiBQcm9qZWN0ZWQgTGFuZCBTdWl0YWJpbGl0eToge3NlbGVjdGVkQ3JvcH08L2gyPlxuXG4gICAgICB7cGxvdERhdGEubGVuZ3RoID4gMCA/IChcbiAgICAgICAgPFBsb3RcbiAgICAgICAgICBkYXRhPXtwbG90RGF0YX1cbiAgICAgICAgICBsYXlvdXQ9e3tcbiAgICAgICAgICAgIHRpdGxlOiBgRXN0aW1hdGVkIExhbmQgU3VpdGFiaWxpdHkgKEJ1c2hlbHMvQWNyZSlgLFxuICAgICAgICAgICAgeGF4aXM6IHsgdGl0bGU6IFwiWWVhclwiIH0sXG4gICAgICAgICAgICB5YXhpczogeyB0aXRsZTogXCJZaWVsZFwiIH0sXG4gICAgICAgICAgICBzaGFwZXM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwibGluZVwiLFxuICAgICAgICAgICAgICAgIHgwOiAyMDI0LFxuICAgICAgICAgICAgICAgIHgxOiAyMDI0LFxuICAgICAgICAgICAgICAgIHkwOiAwLFxuICAgICAgICAgICAgICAgIHkxOiAxLFxuICAgICAgICAgICAgICAgIHhyZWY6IFwieFwiLFxuICAgICAgICAgICAgICAgIHlyZWY6IFwicGFwZXJcIixcbiAgICAgICAgICAgICAgICBsaW5lOiB7IGNvbG9yOiBcImdyZXlcIiwgZGFzaDogXCJkYXNoXCIgfSxcbiAgICAgICAgICAgICAgICBhbm5vdGF0aW9uOiB7IHRleHQ6IFwiMjAyNFwiIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH19XG4gICAgICAgIC8+XG4gICAgICApIDogKFxuICAgICAgICA8cD5Mb2FkaW5nIGRhdGEuLi48L3A+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApO1xufVxuIl0sIm5hbWVzIjpbInVzZVN0YXRlIiwidXNlRWZmZWN0IiwiUGxvdCIsIlBhcGEiLCJUcmVuZHMiLCJzZWxlY3RlZENyb3AiLCJzZXRTZWxlY3RlZENyb3AiLCJkYXRhIiwic2V0RGF0YSIsImNyb3BzIiwiZmV0Y2hEYXRhIiwicmVzcG9uc2UiLCJmZXRjaCIsImNzdiIsInRleHQiLCJwYXJzZWQiLCJwYXJzZSIsImhlYWRlciIsImR5bmFtaWNUeXBpbmciLCJmaWx0ZXJlZERhdGEiLCJmaWx0ZXIiLCJpdGVtIiwiQ3JvcCIsIlllYXIiLCJpbmNsdWRlcyIsImxldmVscyIsInBsb3REYXRhIiwicmVkdWNlIiwiYWNjIiwibGV2ZWxJbmRleCIsImZpbmRJbmRleCIsInNlcmllcyIsIm5hbWUiLCJ4IiwicHVzaCIsInkiLCJZaWVsZCIsIm1vZGUiLCJkaXYiLCJzdHlsZSIsImRpc3BsYXkiLCJqdXN0aWZ5Q29udGVudCIsImgxIiwic2VsZWN0IiwidmFsdWUiLCJvbkNoYW5nZSIsImUiLCJ0YXJnZXQiLCJtYXAiLCJjcm9wIiwib3B0aW9uIiwiaDIiLCJsZW5ndGgiLCJsYXlvdXQiLCJ0aXRsZSIsInhheGlzIiwieWF4aXMiLCJzaGFwZXMiLCJ0eXBlIiwieDAiLCJ4MSIsInkwIiwieTEiLCJ4cmVmIiwieXJlZiIsImxpbmUiLCJjb2xvciIsImRhc2giLCJhbm5vdGF0aW9uIiwicCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./components/Trends.tsx\n"));

/***/ })

});