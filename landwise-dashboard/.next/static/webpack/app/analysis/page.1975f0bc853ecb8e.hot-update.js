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

/***/ "(app-pages-browser)/./components/LandHistory.tsx":
/*!************************************!*\
  !*** ./components/LandHistory.tsx ***!
  \************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var styled_jsx_style__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! styled-jsx/style */ \"(app-pages-browser)/./node_modules/styled-jsx/style.js\");\n/* harmony import */ var styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(styled_jsx_style__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var react_leaflet__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-leaflet */ \"(app-pages-browser)/./node_modules/react-leaflet/lib/TileLayer.js\");\n/* harmony import */ var react_leaflet__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-leaflet */ \"(app-pages-browser)/./node_modules/react-leaflet/lib/ImageOverlay.js\");\n/* harmony import */ var leaflet_dist_leaflet_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! leaflet/dist/leaflet.css */ \"(app-pages-browser)/./node_modules/leaflet/dist/leaflet.css\");\n/* harmony import */ var next_dynamic__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/dynamic */ \"(app-pages-browser)/./node_modules/next/dist/api/app-dynamic.js\");\n/* harmony import */ var _barrel_optimize_names_Slider_mui_material__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! __barrel_optimize__?names=Slider!=!@mui/material */ \"(app-pages-browser)/./node_modules/@mui/material/Slider/Slider.js\");\n/* harmony import */ var geotiff__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! geotiff */ \"(app-pages-browser)/./node_modules/geotiff/dist-module/geotiff.js\");\n/* harmony import */ var chroma_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! chroma-js */ \"(app-pages-browser)/./node_modules/chroma-js/chroma.js\");\n/* harmony import */ var chroma_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(chroma_js__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _types_valuesToNames__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/types/valuesToNames */ \"(app-pages-browser)/./types/valuesToNames.ts\");\n\nvar _s = $RefreshSig$();\n\n\n\n\n\n\n\n\n\nconst DynamicMapContainer = (0,next_dynamic__WEBPACK_IMPORTED_MODULE_4__[\"default\"])(()=>__webpack_require__.e(/*! import() */ \"_app-pages-browser_node_modules_react-leaflet_lib_index_js\").then(__webpack_require__.bind(__webpack_require__, /*! react-leaflet */ \"(app-pages-browser)/./node_modules/react-leaflet/lib/index.js\")).then((mod)=>mod.MapContainer), {\n    loadableGenerated: {\n        modules: [\n            \"components/LandHistory.tsx -> \" + \"react-leaflet\"\n        ]\n    },\n    ssr: false\n});\n_c = DynamicMapContainer;\nconst colors = chroma_js__WEBPACK_IMPORTED_MODULE_5___default().scale(\"Set3\").colors(Object.keys(_types_valuesToNames__WEBPACK_IMPORTED_MODULE_6__.valuesToNames).length);\nconst fetchRasterData = async (url)=>{\n    const response = await fetch(url);\n    const arrayBuffer = await response.arrayBuffer();\n    const tiff = await (0,geotiff__WEBPACK_IMPORTED_MODULE_7__.fromArrayBuffer)(arrayBuffer);\n    const image = await tiff.getImage();\n    const rasterData = await image.readRasters();\n    const width = image.getWidth();\n    const height = image.getHeight();\n    return {\n        rasterData,\n        width,\n        height\n    };\n};\nconst rasterToImageURL = (rasterData, width, height)=>{\n    // Create a hidden canvas element\n    const canvas = document.createElement(\"canvas\");\n    canvas.width = width;\n    canvas.height = height;\n    const ctx = canvas.getContext(\"2d\");\n    const imageData = ctx.createImageData(width, height);\n    for(let i = 0; i < rasterData.length; i++){\n        const value = rasterData[i];\n        const index = Object.keys(_types_valuesToNames__WEBPACK_IMPORTED_MODULE_6__.valuesToNames).findIndex((key)=>parseInt(key) === value);\n        const color = index !== -1 ? colors[index] : chroma_js__WEBPACK_IMPORTED_MODULE_5___default()(\"black\"); // Handle missing colors\n        const [r, g, b] = color.rgb();\n        imageData.data[i * 4] = r;\n        imageData.data[i * 4 + 1] = g;\n        imageData.data[i * 4 + 2] = b;\n        imageData.data[i * 4 + 3] = 255; // Alpha channel, fully opaque\n    }\n    ctx.putImageData(imageData, 0, 0);\n    return canvas.toDataURL();\n};\nconst LandHistory = (param)=>{\n    let { latitude, longitude } = param;\n    _s();\n    const lat = parseFloat(latitude);\n    const lng = parseFloat(longitude);\n    const zoom = 14;\n    const rasterDataCache = (0,react__WEBPACK_IMPORTED_MODULE_2__.useRef)();\n    const [year, setYear] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(2014);\n    const [rasterData, setRasterData] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(null);\n    const [selectedColors, setSelectedColors] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)({});\n    // Fetch raster data for all years on mount\n    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(()=>{\n        const fetchAllRasterData = async ()=>{\n            const years = [\n                2014,\n                2015,\n                2016,\n                2017,\n                2018,\n                2019,\n                2020,\n                2021\n            ];\n            const rasterDataForYears = {};\n            for (const yr of years){\n                const rasterFile = \"/demo/land_history/prior_inventory/\".concat(yr, \".tif\");\n                const data = await fetchRasterData(rasterFile);\n                rasterDataForYears[yr] = data;\n            }\n            // Store all fetched data in cache\n            rasterDataCache.current = rasterDataForYears;\n            // Set initial year data\n            setRasterData(rasterDataForYears[year]);\n            updateLegend(rasterDataForYears[year]);\n        };\n        fetchAllRasterData();\n    }, []);\n    // Update map and legend when the year is changed\n    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(()=>{\n        if (rasterDataCache.current && rasterDataCache.current[year]) {\n            const { rasterData, width, height } = rasterDataCache.current[year];\n            const imageUrl = rasterToImageURL(rasterData, width, height);\n            console.log(rasterData);\n            console.log(width, height);\n            setRasterData(imageUrl);\n            updateLegend(rasterData);\n        }\n    }, [\n        year\n    ]);\n    const updateLegend = (data)=>{\n        const flatData = data;\n        const uniqueElements = new Set(flatData);\n        const newSelectedColors = {};\n        uniqueElements.forEach((value)=>{\n            const name = _types_valuesToNames__WEBPACK_IMPORTED_MODULE_6__.valuesToNames[value];\n            if (name) {\n                const index = Object.keys(_types_valuesToNames__WEBPACK_IMPORTED_MODULE_6__.valuesToNames).findIndex((key)=>parseInt(key) === value);\n                newSelectedColors[name] = colors[index];\n            }\n        });\n        setSelectedColors(newSelectedColors);\n    };\n    const handleYearChange = (event, newValue)=>{\n        setYear(newValue);\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"jsx-182ba5c1535f845a\" + \" \" + \"land-history-container\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"jsx-182ba5c1535f845a\" + \" \" + \"controls\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h1\", {\n                        className: \"jsx-182ba5c1535f845a\",\n                        children: \"Land History\"\n                    }, void 0, false, {\n                        fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                        lineNumber: 125,\n                        columnNumber: 9\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_Slider_mui_material__WEBPACK_IMPORTED_MODULE_8__[\"default\"], {\n                        value: year,\n                        onChange: handleYearChange,\n                        min: 2014,\n                        max: 2021,\n                        step: 1,\n                        valueLabelDisplay: \"auto\",\n                        marks: true\n                    }, void 0, false, {\n                        fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                        lineNumber: 126,\n                        columnNumber: 9\n                    }, undefined)\n                ]\n            }, void 0, true, {\n                fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                lineNumber: 124,\n                columnNumber: 7\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"jsx-182ba5c1535f845a\" + \" \" + \"map-and-legend\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(DynamicMapContainer, {\n                        center: [\n                            lat,\n                            lng\n                        ],\n                        zoom: zoom,\n                        style: {\n                            height: \"400px\",\n                            width: \"100%\"\n                        },\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_leaflet__WEBPACK_IMPORTED_MODULE_9__.TileLayer, {\n                                attribution: '\\xa9 <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',\n                                url: \"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png\"\n                            }, void 0, false, {\n                                fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                                lineNumber: 144,\n                                columnNumber: 11\n                            }, undefined),\n                            rasterData && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_leaflet__WEBPACK_IMPORTED_MODULE_10__.ImageOverlay, {\n                                url: rasterData,\n                                bounds: [\n                                    [\n                                        lat - 0.01,\n                                        lng - 0.01\n                                    ],\n                                    [\n                                        lat + 0.01,\n                                        lng + 0.01\n                                    ]\n                                ],\n                                opacity: 0.7\n                            }, void 0, false, {\n                                fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                                lineNumber: 149,\n                                columnNumber: 13\n                            }, undefined)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                        lineNumber: 139,\n                        columnNumber: 9\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"jsx-182ba5c1535f845a\" + \" \" + \"legend\",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h3\", {\n                                className: \"jsx-182ba5c1535f845a\",\n                                children: \"Legend\"\n                            }, void 0, false, {\n                                fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                                lineNumber: 159,\n                                columnNumber: 11\n                            }, undefined),\n                            Object.keys(selectedColors).map((key)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                    className: \"jsx-182ba5c1535f845a\" + \" \" + \"legend-item\",\n                                    children: [\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                            style: {\n                                                backgroundColor: selectedColors[key]\n                                            },\n                                            className: \"jsx-182ba5c1535f845a\" + \" \" + \"legend-color\"\n                                        }, void 0, false, {\n                                            fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                                            lineNumber: 162,\n                                            columnNumber: 15\n                                        }, undefined),\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                            className: \"jsx-182ba5c1535f845a\" + \" \" + \"legend-label\",\n                                            children: key\n                                        }, void 0, false, {\n                                            fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                                            lineNumber: 166,\n                                            columnNumber: 15\n                                        }, undefined)\n                                    ]\n                                }, key, true, {\n                                    fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                                    lineNumber: 161,\n                                    columnNumber: 13\n                                }, undefined))\n                        ]\n                    }, void 0, true, {\n                        fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                        lineNumber: 158,\n                        columnNumber: 9\n                    }, undefined)\n                ]\n            }, void 0, true, {\n                fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                lineNumber: 137,\n                columnNumber: 7\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default()), {\n                id: \"182ba5c1535f845a\",\n                children: \".land-history-container.jsx-182ba5c1535f845a{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.controls.jsx-182ba5c1535f845a{margin-bottom:20px}.map-and-legend.jsx-182ba5c1535f845a{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;width:100%}.legend.jsx-182ba5c1535f845a{margin-left:20px}.legend-item.jsx-182ba5c1535f845a{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;margin-bottom:5px}.legend-color.jsx-182ba5c1535f845a{width:20px;height:20px;margin-right:10px}\"\n            }, void 0, false, void 0, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n        lineNumber: 123,\n        columnNumber: 5\n    }, undefined);\n};\n_s(LandHistory, \"/QuZkkWxsXFYP70nPa6ez65ZjOw=\");\n_c1 = LandHistory;\n/* harmony default export */ __webpack_exports__[\"default\"] = (LandHistory);\nvar _c, _c1;\n$RefreshReg$(_c, \"DynamicMapContainer\");\n$RefreshReg$(_c1, \"LandHistory\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2NvbXBvbmVudHMvTGFuZEhpc3RvcnkudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFvRDtBQUNrQjtBQUNwQztBQUNDO0FBQ0k7QUFDRztBQUNYO0FBQ3VCO0FBRXRELE1BQU1VLHNCQUFzQkwsd0RBQU9BLENBQ2pDLElBQU0sNk9BQXVCLENBQUNNLElBQUksQ0FBQyxDQUFDQyxNQUFRQSxJQUFJQyxZQUFZOzs7Ozs7SUFDMURDLEtBQUs7O0tBRkhKO0FBS04sTUFBTUssU0FBU1Asc0RBQVksQ0FBQyxRQUFRTyxNQUFNLENBQUNFLE9BQU9DLElBQUksQ0FBQ1QsK0RBQWFBLEVBQUVVLE1BQU07QUFFNUUsTUFBTUMsa0JBQWtCLE9BQU9DO0lBQzdCLE1BQU1DLFdBQVcsTUFBTUMsTUFBTUY7SUFDN0IsTUFBTUcsY0FBYyxNQUFNRixTQUFTRSxXQUFXO0lBQzlDLE1BQU1DLE9BQU8sTUFBTWxCLHdEQUFlQSxDQUFDaUI7SUFDbkMsTUFBTUUsUUFBUSxNQUFNRCxLQUFLRSxRQUFRO0lBQ2pDLE1BQU1DLGFBQWEsTUFBTUYsTUFBTUcsV0FBVztJQUMxQyxNQUFNQyxRQUFRSixNQUFNSyxRQUFRO0lBQzVCLE1BQU1DLFNBQVNOLE1BQU1PLFNBQVM7SUFFOUIsT0FBTztRQUFFTDtRQUFZRTtRQUFPRTtJQUFPO0FBQUU7QUFFdkMsTUFBTUUsbUJBQW1CLENBQUNOLFlBQVlFLE9BQU9FO0lBQzNDLGlDQUFpQztJQUNqQyxNQUFNRyxTQUFTQyxTQUFTQyxhQUFhLENBQUM7SUFDdENGLE9BQU9MLEtBQUssR0FBR0E7SUFDZkssT0FBT0gsTUFBTSxHQUFHQTtJQUNoQixNQUFNTSxNQUFNSCxPQUFPSSxVQUFVLENBQUM7SUFFOUIsTUFBTUMsWUFBWUYsSUFBSUcsZUFBZSxDQUFDWCxPQUFPRTtJQUU3QyxJQUFLLElBQUlVLElBQUksR0FBR0EsSUFBSWQsV0FBV1QsTUFBTSxFQUFFdUIsSUFBSztRQUMxQyxNQUFNQyxRQUFRZixVQUFVLENBQUNjLEVBQUU7UUFDM0IsTUFBTUUsUUFBUTNCLE9BQU9DLElBQUksQ0FBQ1QsK0RBQWFBLEVBQUVvQyxTQUFTLENBQUMsQ0FBQ0MsTUFBUUMsU0FBU0QsU0FBU0g7UUFDOUUsTUFBTUssUUFBUUosVUFBVSxDQUFDLElBQUk3QixNQUFNLENBQUM2QixNQUFNLEdBQUdwQyxnREFBTUEsQ0FBQyxVQUFXLHdCQUF3QjtRQUN2RixNQUFNLENBQUN5QyxHQUFHQyxHQUFHQyxFQUFFLEdBQUdILE1BQU1JLEdBQUc7UUFFM0JaLFVBQVVhLElBQUksQ0FBQ1gsSUFBSSxFQUFFLEdBQUdPO1FBQ3hCVCxVQUFVYSxJQUFJLENBQUNYLElBQUksSUFBSSxFQUFFLEdBQUdRO1FBQzVCVixVQUFVYSxJQUFJLENBQUNYLElBQUksSUFBSSxFQUFFLEdBQUdTO1FBQzVCWCxVQUFVYSxJQUFJLENBQUNYLElBQUksSUFBSSxFQUFFLEdBQUcsS0FBSyw4QkFBOEI7SUFDakU7SUFFQUosSUFBSWdCLFlBQVksQ0FBQ2QsV0FBVyxHQUFHO0lBRS9CLE9BQU9MLE9BQU9vQixTQUFTO0FBQ3pCO0FBR0EsTUFBTUMsY0FBYztRQUFDLEVBQUVDLFFBQVEsRUFBRUMsU0FBUyxFQUFFOztJQUMxQyxNQUFNQyxNQUFNQyxXQUFXSDtJQUN2QixNQUFNSSxNQUFNRCxXQUFXRjtJQUN2QixNQUFNSSxPQUFPO0lBRWIsTUFBTUMsa0JBQWtCN0QsNkNBQU1BO0lBQzlCLE1BQU0sQ0FBQzhELE1BQU1DLFFBQVEsR0FBR2hFLCtDQUFRQSxDQUFDO0lBQ2pDLE1BQU0sQ0FBQzJCLFlBQVlzQyxjQUFjLEdBQUdqRSwrQ0FBUUEsQ0FBQztJQUM3QyxNQUFNLENBQUNrRSxnQkFBZ0JDLGtCQUFrQixHQUFHbkUsK0NBQVFBLENBQUMsQ0FBQztJQUV0RCwyQ0FBMkM7SUFDM0NELGdEQUFTQSxDQUFDO1FBQ1IsTUFBTXFFLHFCQUFxQjtZQUN6QixNQUFNQyxRQUFRO2dCQUFDO2dCQUFNO2dCQUFNO2dCQUFNO2dCQUFNO2dCQUFNO2dCQUFNO2dCQUFNO2FBQUs7WUFDOUQsTUFBTUMscUJBQXFCLENBQUM7WUFFNUIsS0FBSyxNQUFNQyxNQUFNRixNQUFPO2dCQUN0QixNQUFNRyxhQUFhLHNDQUF5QyxPQUFIRCxJQUFHO2dCQUM1RCxNQUFNbkIsT0FBTyxNQUFNakMsZ0JBQWdCcUQ7Z0JBQ25DRixrQkFBa0IsQ0FBQ0MsR0FBRyxHQUFHbkI7WUFDM0I7WUFFQSxrQ0FBa0M7WUFDbENVLGdCQUFnQlcsT0FBTyxHQUFHSDtZQUUxQix3QkFBd0I7WUFDeEJMLGNBQWNLLGtCQUFrQixDQUFDUCxLQUFLO1lBQ3RDVyxhQUFhSixrQkFBa0IsQ0FBQ1AsS0FBSztRQUN2QztRQUVBSztJQUNGLEdBQUcsRUFBRTtJQUVMLGlEQUFpRDtJQUNqRHJFLGdEQUFTQSxDQUFDO1FBQ1IsSUFBSStELGdCQUFnQlcsT0FBTyxJQUFJWCxnQkFBZ0JXLE9BQU8sQ0FBQ1YsS0FBSyxFQUFFO1lBQzVELE1BQU0sRUFBRXBDLFVBQVUsRUFBRUUsS0FBSyxFQUFFRSxNQUFNLEVBQUUsR0FBRytCLGdCQUFnQlcsT0FBTyxDQUFDVixLQUFLO1lBQ25FLE1BQU1ZLFdBQVcxQyxpQkFBaUJOLFlBQVlFLE9BQU9FO1lBRXJENkMsUUFBUUMsR0FBRyxDQUFDbEQ7WUFDWmlELFFBQVFDLEdBQUcsQ0FBQ2hELE9BQU9FO1lBRW5Ca0MsY0FBY1U7WUFDZEQsYUFBYS9DO1FBQ2Y7SUFDRixHQUFHO1FBQUNvQztLQUFLO0lBRVQsTUFBTVcsZUFBZSxDQUFDdEI7UUFDcEIsTUFBTTBCLFdBQVcxQjtRQUNqQixNQUFNMkIsaUJBQWlCLElBQUlDLElBQUlGO1FBQy9CLE1BQU1HLG9CQUFvQixDQUFDO1FBRTNCRixlQUFlRyxPQUFPLENBQUMsQ0FBQ3hDO1lBQ3RCLE1BQU15QyxPQUFPM0UsK0RBQWEsQ0FBQ2tDLE1BQU07WUFDakMsSUFBSXlDLE1BQU07Z0JBQ1IsTUFBTXhDLFFBQVEzQixPQUFPQyxJQUFJLENBQUNULCtEQUFhQSxFQUFFb0MsU0FBUyxDQUFDLENBQUNDLE1BQVFDLFNBQVNELFNBQVNIO2dCQUM5RXVDLGlCQUFpQixDQUFDRSxLQUFLLEdBQUdyRSxNQUFNLENBQUM2QixNQUFNO1lBQ3pDO1FBQ0Y7UUFFQXdCLGtCQUFrQmM7SUFDcEI7SUFFQSxNQUFNRyxtQkFBbUIsQ0FBQ0MsT0FBT0M7UUFDL0J0QixRQUFRc0I7SUFDVjtJQUVBLHFCQUNFLDhEQUFDQztrREFBYzs7MEJBQ2IsOERBQUNBOzBEQUFjOztrQ0FDYiw4REFBQ0M7O2tDQUFHOzs7Ozs7a0NBQ0osOERBQUNuRixrRkFBTUE7d0JBQ0xxQyxPQUFPcUI7d0JBQ1AwQixVQUFVTDt3QkFDVk0sS0FBSzt3QkFDTEMsS0FBSzt3QkFDTEMsTUFBTTt3QkFDTkMsbUJBQWtCO3dCQUNsQkMsS0FBSzs7Ozs7Ozs7Ozs7OzBCQUlULDhEQUFDUDswREFBYzs7a0NBRWIsOERBQUM5RTt3QkFDQ3NGLFFBQVE7NEJBQUNyQzs0QkFBS0U7eUJBQUk7d0JBQ2xCQyxNQUFNQTt3QkFDTm1DLE9BQU87NEJBQUVqRSxRQUFROzRCQUFTRixPQUFPO3dCQUFPOzswQ0FFeEMsOERBQUMzQixvREFBU0E7Z0NBQ1IrRixhQUFZO2dDQUNaN0UsS0FBSTs7Ozs7OzRCQUVMTyw0QkFDQyw4REFBQ3hCLHdEQUFZQTtnQ0FDWGlCLEtBQUtPO2dDQUNMdUUsUUFBUTtvQ0FBQzt3Q0FBQ3hDLE1BQU07d0NBQU1FLE1BQU07cUNBQUs7b0NBQUU7d0NBQUNGLE1BQU07d0NBQU1FLE1BQU07cUNBQUs7aUNBQUM7Z0NBQzVEdUMsU0FBUzs7Ozs7Ozs7Ozs7O2tDQU1mLDhEQUFDWjtrRUFBYzs7MENBQ2IsOERBQUNhOzswQ0FBRzs7Ozs7OzRCQUNIcEYsT0FBT0MsSUFBSSxDQUFDaUQsZ0JBQWdCbUMsR0FBRyxDQUFDLENBQUN4RCxvQkFDaEMsOERBQUMwQzs4RUFBd0I7O3NEQUN2Qiw4REFBQ2U7NENBRUNOLE9BQU87Z0RBQUVPLGlCQUFpQnJDLGNBQWMsQ0FBQ3JCLElBQUk7NENBQUM7c0ZBRHBDOzs7Ozs7c0RBR1osOERBQUN5RDtzRkFBZTtzREFBZ0J6RDs7Ozs7OzttQ0FMeEJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF3Q3RCO0dBbEpNVTtNQUFBQTtBQW9KTiwrREFBZUEsV0FBV0EsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9jb21wb25lbnRzL0xhbmRIaXN0b3J5LnRzeD9lZWIzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUsIHVzZVJlZiB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgTWFwQ29udGFpbmVyLCBUaWxlTGF5ZXIsIEltYWdlT3ZlcmxheSB9IGZyb20gXCJyZWFjdC1sZWFmbGV0XCI7XG5pbXBvcnQgXCJsZWFmbGV0L2Rpc3QvbGVhZmxldC5jc3NcIjtcbmltcG9ydCBkeW5hbWljIGZyb20gXCJuZXh0L2R5bmFtaWNcIjtcbmltcG9ydCB7IFNsaWRlciB9IGZyb20gXCJAbXVpL21hdGVyaWFsXCI7XG5pbXBvcnQgeyBmcm9tQXJyYXlCdWZmZXIgfSBmcm9tIFwiZ2VvdGlmZlwiO1xuaW1wb3J0IGNocm9tYSBmcm9tICdjaHJvbWEtanMnO1xuaW1wb3J0IHsgdmFsdWVzVG9OYW1lcyB9IGZyb20gJ0AvdHlwZXMvdmFsdWVzVG9OYW1lcyc7XG5cbmNvbnN0IER5bmFtaWNNYXBDb250YWluZXIgPSBkeW5hbWljKFxuICAoKSA9PiBpbXBvcnQoXCJyZWFjdC1sZWFmbGV0XCIpLnRoZW4oKG1vZCkgPT4gbW9kLk1hcENvbnRhaW5lciksXG4gIHsgc3NyOiBmYWxzZSB9XG4pO1xuXG5jb25zdCBjb2xvcnMgPSBjaHJvbWEuc2NhbGUoJ1NldDMnKS5jb2xvcnMoT2JqZWN0LmtleXModmFsdWVzVG9OYW1lcykubGVuZ3RoKTtcblxuY29uc3QgZmV0Y2hSYXN0ZXJEYXRhID0gYXN5bmMgKHVybCkgPT4ge1xuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCk7ICAgIFxuICBjb25zdCBhcnJheUJ1ZmZlciA9IGF3YWl0IHJlc3BvbnNlLmFycmF5QnVmZmVyKCk7ICAgIFxuICBjb25zdCB0aWZmID0gYXdhaXQgZnJvbUFycmF5QnVmZmVyKGFycmF5QnVmZmVyKTsgICAgXG4gIGNvbnN0IGltYWdlID0gYXdhaXQgdGlmZi5nZXRJbWFnZSgpOyAgICBcbiAgY29uc3QgcmFzdGVyRGF0YSA9IGF3YWl0IGltYWdlLnJlYWRSYXN0ZXJzKCk7XG4gIGNvbnN0IHdpZHRoID0gaW1hZ2UuZ2V0V2lkdGgoKTtcbiAgY29uc3QgaGVpZ2h0ID0gaW1hZ2UuZ2V0SGVpZ2h0KCk7XG5cbiAgcmV0dXJuIHsgcmFzdGVyRGF0YSwgd2lkdGgsIGhlaWdodCB9O307XG5cbmNvbnN0IHJhc3RlclRvSW1hZ2VVUkwgPSAocmFzdGVyRGF0YSwgd2lkdGgsIGhlaWdodCkgPT4ge1xuICAvLyBDcmVhdGUgYSBoaWRkZW4gY2FudmFzIGVsZW1lbnRcbiAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgY2FudmFzLndpZHRoID0gd2lkdGg7XG4gIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG4gIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cbiAgY29uc3QgaW1hZ2VEYXRhID0gY3R4LmNyZWF0ZUltYWdlRGF0YSh3aWR0aCwgaGVpZ2h0KTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHJhc3RlckRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCB2YWx1ZSA9IHJhc3RlckRhdGFbaV07XG4gICAgY29uc3QgaW5kZXggPSBPYmplY3Qua2V5cyh2YWx1ZXNUb05hbWVzKS5maW5kSW5kZXgoKGtleSkgPT4gcGFyc2VJbnQoa2V5KSA9PT0gdmFsdWUpO1xuICAgIGNvbnN0IGNvbG9yID0gaW5kZXggIT09IC0xID8gY29sb3JzW2luZGV4XSA6IGNocm9tYSgnYmxhY2snKTsgIC8vIEhhbmRsZSBtaXNzaW5nIGNvbG9yc1xuICAgIGNvbnN0IFtyLCBnLCBiXSA9IGNvbG9yLnJnYigpOyBcblxuICAgIGltYWdlRGF0YS5kYXRhW2kgKiA0XSA9IHI7XG4gICAgaW1hZ2VEYXRhLmRhdGFbaSAqIDQgKyAxXSA9IGc7XG4gICAgaW1hZ2VEYXRhLmRhdGFbaSAqIDQgKyAyXSA9IGI7XG4gICAgaW1hZ2VEYXRhLmRhdGFbaSAqIDQgKyAzXSA9IDI1NTsgLy8gQWxwaGEgY2hhbm5lbCwgZnVsbHkgb3BhcXVlXG4gIH1cblxuICBjdHgucHV0SW1hZ2VEYXRhKGltYWdlRGF0YSwgMCwgMCk7XG5cbiAgcmV0dXJuIGNhbnZhcy50b0RhdGFVUkwoKTtcbn07XG5cblxuY29uc3QgTGFuZEhpc3RvcnkgPSAoeyBsYXRpdHVkZSwgbG9uZ2l0dWRlIH0pID0+IHtcbiAgY29uc3QgbGF0ID0gcGFyc2VGbG9hdChsYXRpdHVkZSk7XG4gIGNvbnN0IGxuZyA9IHBhcnNlRmxvYXQobG9uZ2l0dWRlKTtcbiAgY29uc3Qgem9vbSA9IDE0O1xuXG4gIGNvbnN0IHJhc3RlckRhdGFDYWNoZSA9IHVzZVJlZigpO1xuICBjb25zdCBbeWVhciwgc2V0WWVhcl0gPSB1c2VTdGF0ZSgyMDE0KTtcbiAgY29uc3QgW3Jhc3RlckRhdGEsIHNldFJhc3RlckRhdGFdID0gdXNlU3RhdGUobnVsbCk7XG4gIGNvbnN0IFtzZWxlY3RlZENvbG9ycywgc2V0U2VsZWN0ZWRDb2xvcnNdID0gdXNlU3RhdGUoe30pO1xuXG4gIC8vIEZldGNoIHJhc3RlciBkYXRhIGZvciBhbGwgeWVhcnMgb24gbW91bnRcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBmZXRjaEFsbFJhc3RlckRhdGEgPSBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB5ZWFycyA9IFsyMDE0LCAyMDE1LCAyMDE2LCAyMDE3LCAyMDE4LCAyMDE5LCAyMDIwLCAyMDIxXTtcbiAgICAgIGNvbnN0IHJhc3RlckRhdGFGb3JZZWFycyA9IHt9O1xuXG4gICAgICBmb3IgKGNvbnN0IHlyIG9mIHllYXJzKSB7XG4gICAgICAgIGNvbnN0IHJhc3RlckZpbGUgPSBgL2RlbW8vbGFuZF9oaXN0b3J5L3ByaW9yX2ludmVudG9yeS8ke3lyfS50aWZgO1xuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgZmV0Y2hSYXN0ZXJEYXRhKHJhc3RlckZpbGUpO1xuICAgICAgICByYXN0ZXJEYXRhRm9yWWVhcnNbeXJdID0gZGF0YTtcbiAgICAgIH1cblxuICAgICAgLy8gU3RvcmUgYWxsIGZldGNoZWQgZGF0YSBpbiBjYWNoZVxuICAgICAgcmFzdGVyRGF0YUNhY2hlLmN1cnJlbnQgPSByYXN0ZXJEYXRhRm9yWWVhcnM7XG5cbiAgICAgIC8vIFNldCBpbml0aWFsIHllYXIgZGF0YVxuICAgICAgc2V0UmFzdGVyRGF0YShyYXN0ZXJEYXRhRm9yWWVhcnNbeWVhcl0pO1xuICAgICAgdXBkYXRlTGVnZW5kKHJhc3RlckRhdGFGb3JZZWFyc1t5ZWFyXSk7XG4gICAgfTtcblxuICAgIGZldGNoQWxsUmFzdGVyRGF0YSgpO1xuICB9LCBbXSk7XG5cbiAgLy8gVXBkYXRlIG1hcCBhbmQgbGVnZW5kIHdoZW4gdGhlIHllYXIgaXMgY2hhbmdlZFxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChyYXN0ZXJEYXRhQ2FjaGUuY3VycmVudCAmJiByYXN0ZXJEYXRhQ2FjaGUuY3VycmVudFt5ZWFyXSkge1xuICAgICAgY29uc3QgeyByYXN0ZXJEYXRhLCB3aWR0aCwgaGVpZ2h0IH0gPSByYXN0ZXJEYXRhQ2FjaGUuY3VycmVudFt5ZWFyXTtcbiAgICAgIGNvbnN0IGltYWdlVXJsID0gcmFzdGVyVG9JbWFnZVVSTChyYXN0ZXJEYXRhLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgY29uc29sZS5sb2cocmFzdGVyRGF0YSk7XG4gICAgICBjb25zb2xlLmxvZyh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgXG4gICAgICBzZXRSYXN0ZXJEYXRhKGltYWdlVXJsKTtcbiAgICAgIHVwZGF0ZUxlZ2VuZChyYXN0ZXJEYXRhKTtcbiAgICB9XG4gIH0sIFt5ZWFyXSk7XG4gIFxuICBjb25zdCB1cGRhdGVMZWdlbmQgPSAoZGF0YSkgPT4geyAgICAgIFxuICAgIGNvbnN0IGZsYXREYXRhID0gZGF0YTtcbiAgICBjb25zdCB1bmlxdWVFbGVtZW50cyA9IG5ldyBTZXQoZmxhdERhdGEpO1xuICAgIGNvbnN0IG5ld1NlbGVjdGVkQ29sb3JzID0ge307XG4gIFxuICAgIHVuaXF1ZUVsZW1lbnRzLmZvckVhY2goKHZhbHVlKSA9PiB7XG4gICAgICBjb25zdCBuYW1lID0gdmFsdWVzVG9OYW1lc1t2YWx1ZV07XG4gICAgICBpZiAobmFtZSkge1xuICAgICAgICBjb25zdCBpbmRleCA9IE9iamVjdC5rZXlzKHZhbHVlc1RvTmFtZXMpLmZpbmRJbmRleCgoa2V5KSA9PiBwYXJzZUludChrZXkpID09PSB2YWx1ZSk7XG4gICAgICAgIG5ld1NlbGVjdGVkQ29sb3JzW25hbWVdID0gY29sb3JzW2luZGV4XTtcbiAgICAgIH1cbiAgICB9KTtcbiAgXG4gICAgc2V0U2VsZWN0ZWRDb2xvcnMobmV3U2VsZWN0ZWRDb2xvcnMpO1xuICB9O1xuXG4gIGNvbnN0IGhhbmRsZVllYXJDaGFuZ2UgPSAoZXZlbnQsIG5ld1ZhbHVlKSA9PiB7XG4gICAgc2V0WWVhcihuZXdWYWx1ZSk7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImxhbmQtaGlzdG9yeS1jb250YWluZXJcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udHJvbHNcIj5cbiAgICAgICAgPGgxPkxhbmQgSGlzdG9yeTwvaDE+XG4gICAgICAgIDxTbGlkZXJcbiAgICAgICAgICB2YWx1ZT17eWVhcn1cbiAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlWWVhckNoYW5nZX1cbiAgICAgICAgICBtaW49ezIwMTR9XG4gICAgICAgICAgbWF4PXsyMDIxfVxuICAgICAgICAgIHN0ZXA9ezF9XG4gICAgICAgICAgdmFsdWVMYWJlbERpc3BsYXk9XCJhdXRvXCJcbiAgICAgICAgICBtYXJrc1xuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWFwLWFuZC1sZWdlbmRcIj5cbiAgICAgICAgey8qIExlYWZsZXQgTWFwICovfVxuICAgICAgICA8RHluYW1pY01hcENvbnRhaW5lclxuICAgICAgICAgIGNlbnRlcj17W2xhdCwgbG5nXX1cbiAgICAgICAgICB6b29tPXt6b29tfVxuICAgICAgICAgIHN0eWxlPXt7IGhlaWdodDogXCI0MDBweFwiLCB3aWR0aDogXCIxMDAlXCIgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxUaWxlTGF5ZXJcbiAgICAgICAgICAgIGF0dHJpYnV0aW9uPScmY29weTsgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycydcbiAgICAgICAgICAgIHVybD1cImh0dHBzOi8ve3N9LnRpbGUub3BlbnN0cmVldG1hcC5vcmcve3p9L3t4fS97eX0ucG5nXCJcbiAgICAgICAgICAvPlxuICAgICAgICAgIHtyYXN0ZXJEYXRhICYmIChcbiAgICAgICAgICAgIDxJbWFnZU92ZXJsYXlcbiAgICAgICAgICAgICAgdXJsPXtyYXN0ZXJEYXRhfSBcbiAgICAgICAgICAgICAgYm91bmRzPXtbW2xhdCAtIDAuMDEsIGxuZyAtIDAuMDFdLCBbbGF0ICsgMC4wMSwgbG5nICsgMC4wMV1dfVxuICAgICAgICAgICAgICBvcGFjaXR5PXswLjd9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvRHluYW1pY01hcENvbnRhaW5lcj5cblxuICAgICAgICB7LyogTGVnZW5kICovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxlZ2VuZFwiPlxuICAgICAgICAgIDxoMz5MZWdlbmQ8L2gzPlxuICAgICAgICAgIHtPYmplY3Qua2V5cyhzZWxlY3RlZENvbG9ycykubWFwKChrZXkpID0+IChcbiAgICAgICAgICAgIDxkaXYga2V5PXtrZXl9IGNsYXNzTmFtZT1cImxlZ2VuZC1pdGVtXCI+XG4gICAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibGVnZW5kLWNvbG9yXCJcbiAgICAgICAgICAgICAgICBzdHlsZT17eyBiYWNrZ3JvdW5kQ29sb3I6IHNlbGVjdGVkQ29sb3JzW2tleV0gfX1cbiAgICAgICAgICAgICAgPjwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibGVnZW5kLWxhYmVsXCI+e2tleX08L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPHN0eWxlIGpzeD57YFxuICAgICAgICAubGFuZC1oaXN0b3J5LWNvbnRhaW5lciB7XG4gICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIH1cbiAgICAgICAgLmNvbnRyb2xzIHtcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAyMHB4O1xuICAgICAgICB9XG4gICAgICAgIC5tYXAtYW5kLWxlZ2VuZCB7XG4gICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgfVxuICAgICAgICAubGVnZW5kIHtcbiAgICAgICAgICBtYXJnaW4tbGVmdDogMjBweDtcbiAgICAgICAgfVxuICAgICAgICAubGVnZW5kLWl0ZW0ge1xuICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiA1cHg7XG4gICAgICAgIH1cbiAgICAgICAgLmxlZ2VuZC1jb2xvciB7XG4gICAgICAgICAgd2lkdGg6IDIwcHg7XG4gICAgICAgICAgaGVpZ2h0OiAyMHB4O1xuICAgICAgICAgIG1hcmdpbi1yaWdodDogMTBweDtcbiAgICAgICAgfVxuICAgICAgYH08L3N0eWxlPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgTGFuZEhpc3Rvcnk7XG4iXSwibmFtZXMiOlsidXNlRWZmZWN0IiwidXNlU3RhdGUiLCJ1c2VSZWYiLCJUaWxlTGF5ZXIiLCJJbWFnZU92ZXJsYXkiLCJkeW5hbWljIiwiU2xpZGVyIiwiZnJvbUFycmF5QnVmZmVyIiwiY2hyb21hIiwidmFsdWVzVG9OYW1lcyIsIkR5bmFtaWNNYXBDb250YWluZXIiLCJ0aGVuIiwibW9kIiwiTWFwQ29udGFpbmVyIiwic3NyIiwiY29sb3JzIiwic2NhbGUiLCJPYmplY3QiLCJrZXlzIiwibGVuZ3RoIiwiZmV0Y2hSYXN0ZXJEYXRhIiwidXJsIiwicmVzcG9uc2UiLCJmZXRjaCIsImFycmF5QnVmZmVyIiwidGlmZiIsImltYWdlIiwiZ2V0SW1hZ2UiLCJyYXN0ZXJEYXRhIiwicmVhZFJhc3RlcnMiLCJ3aWR0aCIsImdldFdpZHRoIiwiaGVpZ2h0IiwiZ2V0SGVpZ2h0IiwicmFzdGVyVG9JbWFnZVVSTCIsImNhbnZhcyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImN0eCIsImdldENvbnRleHQiLCJpbWFnZURhdGEiLCJjcmVhdGVJbWFnZURhdGEiLCJpIiwidmFsdWUiLCJpbmRleCIsImZpbmRJbmRleCIsImtleSIsInBhcnNlSW50IiwiY29sb3IiLCJyIiwiZyIsImIiLCJyZ2IiLCJkYXRhIiwicHV0SW1hZ2VEYXRhIiwidG9EYXRhVVJMIiwiTGFuZEhpc3RvcnkiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsImxhdCIsInBhcnNlRmxvYXQiLCJsbmciLCJ6b29tIiwicmFzdGVyRGF0YUNhY2hlIiwieWVhciIsInNldFllYXIiLCJzZXRSYXN0ZXJEYXRhIiwic2VsZWN0ZWRDb2xvcnMiLCJzZXRTZWxlY3RlZENvbG9ycyIsImZldGNoQWxsUmFzdGVyRGF0YSIsInllYXJzIiwicmFzdGVyRGF0YUZvclllYXJzIiwieXIiLCJyYXN0ZXJGaWxlIiwiY3VycmVudCIsInVwZGF0ZUxlZ2VuZCIsImltYWdlVXJsIiwiY29uc29sZSIsImxvZyIsImZsYXREYXRhIiwidW5pcXVlRWxlbWVudHMiLCJTZXQiLCJuZXdTZWxlY3RlZENvbG9ycyIsImZvckVhY2giLCJuYW1lIiwiaGFuZGxlWWVhckNoYW5nZSIsImV2ZW50IiwibmV3VmFsdWUiLCJkaXYiLCJoMSIsIm9uQ2hhbmdlIiwibWluIiwibWF4Iiwic3RlcCIsInZhbHVlTGFiZWxEaXNwbGF5IiwibWFya3MiLCJjZW50ZXIiLCJzdHlsZSIsImF0dHJpYnV0aW9uIiwiYm91bmRzIiwib3BhY2l0eSIsImgzIiwibWFwIiwic3BhbiIsImJhY2tncm91bmRDb2xvciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./components/LandHistory.tsx\n"));

/***/ })

});