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

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var styled_jsx_style__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! styled-jsx/style */ \"(app-pages-browser)/./node_modules/styled-jsx/style.js\");\n/* harmony import */ var styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(styled_jsx_style__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var react_leaflet__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-leaflet */ \"(app-pages-browser)/./node_modules/react-leaflet/lib/MapContainer.js\");\n/* harmony import */ var react_leaflet__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-leaflet */ \"(app-pages-browser)/./node_modules/react-leaflet/lib/TileLayer.js\");\n/* harmony import */ var react_leaflet__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-leaflet */ \"(app-pages-browser)/./node_modules/react-leaflet/lib/ImageOverlay.js\");\n/* harmony import */ var leaflet_dist_leaflet_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! leaflet/dist/leaflet.css */ \"(app-pages-browser)/./node_modules/leaflet/dist/leaflet.css\");\n/* harmony import */ var _barrel_optimize_names_Slider_mui_material__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! __barrel_optimize__?names=Slider!=!@mui/material */ \"(app-pages-browser)/./node_modules/@mui/material/Slider/Slider.js\");\n/* harmony import */ var geotiff__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! geotiff */ \"(app-pages-browser)/./node_modules/geotiff/dist-module/geotiff.js\");\n/* harmony import */ var chroma_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! chroma-js */ \"(app-pages-browser)/./node_modules/chroma-js/chroma.js\");\n/* harmony import */ var chroma_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(chroma_js__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _types_valuesToNames__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/types/valuesToNames */ \"(app-pages-browser)/./types/valuesToNames.ts\");\n/* __next_internal_client_entry_do_not_use__ default auto */ \nvar _s = $RefreshSig$();\n\n\n\n\n\n\n\n\nconst LandHistory = (param)=>{\n    let { latitude, longitude } = param;\n    _s();\n    const lat = parseFloat(latitude);\n    const lng = parseFloat(longitude);\n    const zoom = 15;\n    const rasterDataCache = (0,react__WEBPACK_IMPORTED_MODULE_2__.useRef)();\n    const [year, setYear] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(2014);\n    const [rasterData, setRasterData] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(null);\n    const [imageBounds, setImageBounds] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(null);\n    const [selectedColors, setSelectedColors] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)({});\n    const colors = chroma_js__WEBPACK_IMPORTED_MODULE_4___default().scale(\"Set3\").colors(Object.keys(_types_valuesToNames__WEBPACK_IMPORTED_MODULE_5__.valuesToNames).length);\n    const fetchRasterData = async (url)=>{\n        const response = await fetch(url);\n        const arrayBuffer = await response.arrayBuffer();\n        const tiff = await (0,geotiff__WEBPACK_IMPORTED_MODULE_6__.fromArrayBuffer)(arrayBuffer);\n        const image = await tiff.getImage();\n        const rasterData = await image.readRasters();\n        const width = image.getWidth();\n        const height = image.getHeight();\n        const bbox = image.getBoundingBox();\n        return {\n            rasterData,\n            width,\n            height,\n            bbox\n        };\n    };\n    const rasterToImageURL = (rasterData, width, height)=>{\n        // Create a hidden canvas element\n        const canvas = document.createElement(\"canvas\");\n        canvas.width = width;\n        canvas.height = height;\n        const ctx = canvas.getContext(\"2d\");\n        const imageData = ctx.createImageData(width, height);\n        for(let i = 0; i < rasterData[0].length; i++){\n            const value = rasterData[0][i];\n            const index = Object.keys(_types_valuesToNames__WEBPACK_IMPORTED_MODULE_5__.valuesToNames).findIndex((key)=>parseInt(key) === value);\n            const color = index !== -1 ? chroma_js__WEBPACK_IMPORTED_MODULE_4___default()(colors[index]) : chroma_js__WEBPACK_IMPORTED_MODULE_4___default()(\"black\"); // Handle missing colors\n            const [r, g, b] = color.rgb();\n            let a = 255;\n            if (value == 0 || value == 10) {\n                a = 0;\n            }\n            imageData.data[i * 4] = r;\n            imageData.data[i * 4 + 1] = g;\n            imageData.data[i * 4 + 2] = b;\n            imageData.data[i * 4 + 3] = a;\n        }\n        ctx.putImageData(imageData, 0, 0);\n        return canvas.toDataURL();\n    };\n    // Fetch raster data for all years on mount\n    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(()=>{\n        const fetchAllRasterData = async ()=>{\n            const years = [\n                2014,\n                2015,\n                2016,\n                2017,\n                2018,\n                2019,\n                2020,\n                2021\n            ];\n            const rasterDataForYears = {};\n            for (const yr of years){\n                const rasterFile = \"/demo/land_history/prior_inventory/\".concat(yr, \".tif\");\n                const data = await fetchRasterData(rasterFile);\n                rasterDataForYears[yr] = data;\n            }\n            // Store all fetched data in cache\n            rasterDataCache.current = rasterDataForYears;\n            // Set initial year data\n            const rd = rasterDataForYears[year].rasterData;\n            const w = rasterDataForYears[year].width;\n            const h = rasterDataForYears[year].height;\n            const b = rasterDataForYears[year].bbox;\n            setRasterData(rasterToImageURL(rd, w, h));\n            setImageBounds(b);\n            updateLegend(rd);\n        };\n        fetchAllRasterData();\n    }, []);\n    // Update map and legend when the year is changed\n    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(()=>{\n        if (rasterDataCache.current && rasterDataCache.current[year]) {\n            const { rasterData, width, height, bbox } = rasterDataCache.current[year];\n            const imageUrl = rasterToImageURL(rasterData, width, height);\n            setRasterData(imageUrl);\n            setImageBounds(bbox);\n            updateLegend(rasterData);\n        }\n    }, [\n        year\n    ]);\n    const updateLegend = (data)=>{\n        const flatData = data;\n        const uniqueElements = new Set(flatData);\n        const newSelectedColors = {};\n        uniqueElements.forEach((value)=>{\n            const name = _types_valuesToNames__WEBPACK_IMPORTED_MODULE_5__.valuesToNames[value];\n            if (name) {\n                const index = Object.keys(_types_valuesToNames__WEBPACK_IMPORTED_MODULE_5__.valuesToNames).findIndex((key)=>parseInt(key) === value);\n                newSelectedColors[name] = colors[index];\n            }\n        });\n        cons;\n        setSelectedColors(newSelectedColors);\n    };\n    const handleYearChange = (event, newValue)=>{\n        setYear(newValue);\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"jsx-182ba5c1535f845a\" + \" \" + \"land-history-container\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"jsx-182ba5c1535f845a\" + \" \" + \"flex justify-center items-left\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"jsx-182ba5c1535f845a\" + \" \" + \"mr-4\",\n                        children: \"Select The Year\"\n                    }, void 0, false, {\n                        fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                        lineNumber: 134,\n                        columnNumber: 9\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"jsx-182ba5c1535f845a\" + \" \" + \"controls w-32\",\n                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_Slider_mui_material__WEBPACK_IMPORTED_MODULE_7__[\"default\"], {\n                            value: year,\n                            onChange: handleYearChange,\n                            min: 2014,\n                            max: 2021,\n                            step: 1,\n                            valueLabelDisplay: \"auto\",\n                            marks: true\n                        }, void 0, false, {\n                            fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                            lineNumber: 136,\n                            columnNumber: 11\n                        }, undefined)\n                    }, void 0, false, {\n                        fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                        lineNumber: 135,\n                        columnNumber: 9\n                    }, undefined)\n                ]\n            }, void 0, true, {\n                fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                lineNumber: 133,\n                columnNumber: 7\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"jsx-182ba5c1535f845a\" + \" \" + \"map-and-legend\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_leaflet__WEBPACK_IMPORTED_MODULE_8__.MapContainer, {\n                        center: [\n                            lat,\n                            lng\n                        ],\n                        zoom: zoom,\n                        style: {\n                            height: \"400px\",\n                            width: \"100%\"\n                        },\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_leaflet__WEBPACK_IMPORTED_MODULE_9__.TileLayer, {\n                                attribution: '\\xa9 <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',\n                                url: \"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png\"\n                            }, void 0, false, {\n                                fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                                lineNumber: 156,\n                                columnNumber: 11\n                            }, undefined),\n                            rasterData && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_leaflet__WEBPACK_IMPORTED_MODULE_10__.ImageOverlay, {\n                                url: rasterData,\n                                bounds: [\n                                    [\n                                        imageBounds[1],\n                                        imageBounds[0]\n                                    ],\n                                    [\n                                        imageBounds[3],\n                                        imageBounds[2]\n                                    ]\n                                ],\n                                opacity: 0.7\n                            }, void 0, false, {\n                                fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                                lineNumber: 161,\n                                columnNumber: 13\n                            }, undefined)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                        lineNumber: 151,\n                        columnNumber: 9\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"jsx-182ba5c1535f845a\" + \" \" + \"legend\",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h3\", {\n                                className: \"jsx-182ba5c1535f845a\",\n                                children: \"Legend\"\n                            }, void 0, false, {\n                                fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                                lineNumber: 171,\n                                columnNumber: 11\n                            }, undefined),\n                            Object.keys(selectedColors).map((key)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                    className: \"jsx-182ba5c1535f845a\" + \" \" + \"legend-item\",\n                                    children: [\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                            style: {\n                                                backgroundColor: selectedColors[key]\n                                            },\n                                            className: \"jsx-182ba5c1535f845a\" + \" \" + \"legend-color\"\n                                        }, void 0, false, {\n                                            fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                                            lineNumber: 174,\n                                            columnNumber: 15\n                                        }, undefined),\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                            className: \"jsx-182ba5c1535f845a\" + \" \" + \"legend-label\",\n                                            children: key\n                                        }, void 0, false, {\n                                            fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                                            lineNumber: 178,\n                                            columnNumber: 15\n                                        }, undefined)\n                                    ]\n                                }, key, true, {\n                                    fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                                    lineNumber: 173,\n                                    columnNumber: 13\n                                }, undefined))\n                        ]\n                    }, void 0, true, {\n                        fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                        lineNumber: 170,\n                        columnNumber: 9\n                    }, undefined)\n                ]\n            }, void 0, true, {\n                fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                lineNumber: 149,\n                columnNumber: 7\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default()), {\n                id: \"182ba5c1535f845a\",\n                children: \".land-history-container.jsx-182ba5c1535f845a{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.controls.jsx-182ba5c1535f845a{margin-bottom:20px}.map-and-legend.jsx-182ba5c1535f845a{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;width:100%}.legend.jsx-182ba5c1535f845a{margin-left:20px}.legend-item.jsx-182ba5c1535f845a{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;margin-bottom:5px}.legend-color.jsx-182ba5c1535f845a{width:20px;height:20px;margin-right:10px}\"\n            }, void 0, false, void 0, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n        lineNumber: 132,\n        columnNumber: 5\n    }, undefined);\n};\n_s(LandHistory, \"K+hAUjzs8kxj/ZxTEjioHAYbwjk=\");\n_c = LandHistory;\n/* harmony default export */ __webpack_exports__[\"default\"] = (LandHistory);\nvar _c;\n$RefreshReg$(_c, \"LandHistory\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2NvbXBvbmVudHMvTGFuZEhpc3RvcnkudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVvRDtBQUNrQjtBQUNwQztBQUNLO0FBQ0c7QUFDWDtBQUN1QjtBQUV0RCxNQUFNVSxjQUFjO1FBQUMsRUFBRUMsUUFBUSxFQUFFQyxTQUFTLEVBQUU7O0lBQzFDLE1BQU1DLE1BQU1DLFdBQVdIO0lBQ3ZCLE1BQU1JLE1BQU1ELFdBQVdGO0lBQ3ZCLE1BQU1JLE9BQU87SUFFYixNQUFNQyxrQkFBa0JmLDZDQUFNQTtJQUM5QixNQUFNLENBQUNnQixNQUFNQyxRQUFRLEdBQUdsQiwrQ0FBUUEsQ0FBQztJQUNqQyxNQUFNLENBQUNtQixZQUFZQyxjQUFjLEdBQUdwQiwrQ0FBUUEsQ0FBQztJQUM3QyxNQUFNLENBQUNxQixhQUFhQyxlQUFlLEdBQUd0QiwrQ0FBUUEsQ0FBQztJQUMvQyxNQUFNLENBQUN1QixnQkFBZ0JDLGtCQUFrQixHQUFHeEIsK0NBQVFBLENBQUMsQ0FBQztJQUV0RCxNQUFNeUIsU0FBU2xCLHNEQUFZLENBQUMsUUFBUWtCLE1BQU0sQ0FBQ0UsT0FBT0MsSUFBSSxDQUFDcEIsK0RBQWFBLEVBQUVxQixNQUFNO0lBRTVFLE1BQU1DLGtCQUFrQixPQUFPQztRQUM3QixNQUFNQyxXQUFXLE1BQU1DLE1BQU1GO1FBQzdCLE1BQU1HLGNBQWMsTUFBTUYsU0FBU0UsV0FBVztRQUM5QyxNQUFNQyxPQUFPLE1BQU03Qix3REFBZUEsQ0FBQzRCO1FBQ25DLE1BQU1FLFFBQVEsTUFBTUQsS0FBS0UsUUFBUTtRQUNqQyxNQUFNbEIsYUFBYSxNQUFNaUIsTUFBTUUsV0FBVztRQUMxQyxNQUFNQyxRQUFRSCxNQUFNSSxRQUFRO1FBQzVCLE1BQU1DLFNBQVNMLE1BQU1NLFNBQVM7UUFDOUIsTUFBTUMsT0FBT1AsTUFBTVEsY0FBYztRQUVqQyxPQUFPO1lBQUN6QjtZQUFZb0I7WUFBT0U7WUFBUUU7UUFBSTtJQUN6QztJ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QUVBLFdBQVcsQ0FBQyxFQUFFO3FDQUFDO29DQUFFO3dDQUFDQSxXQUFXLENBQUMsRUFBRTt3Q0FBRUEsV0FBVyxDQUFDLEVBQUU7cUNBQUM7aUNBQUM7Z0NBQzVFK0UsU0FBUzs7Ozs7Ozs7Ozs7O2tDQU1mLDhEQUFDWDtrRUFBYzs7MENBQ2IsOERBQUNZOzswQ0FBRzs7Ozs7OzRCQUNIMUUsT0FBT0MsSUFBSSxDQUFDTCxnQkFBZ0IrRSxHQUFHLENBQUMsQ0FBQzdDLG9CQUNoQyw4REFBQ2dDOzhFQUF3Qjs7c0RBQ3ZCLDhEQUFDYzs0Q0FFQ04sT0FBTztnREFBRU8saUJBQWlCakYsY0FBYyxDQUFDa0MsSUFBSTs0Q0FBQztzRkFEcEM7Ozs7OztzREFHWiw4REFBQzhDO3NGQUFlO3NEQUFnQjlDOzs7Ozs7O21DQUx4QkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlDdEI7R0EzTU1oRDtLQUFBQTtBQTZNTiwrREFBZUEsV0FBV0EsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9jb21wb25lbnRzL0xhbmRIaXN0b3J5LnRzeD9lZWIzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50JztcblxuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSwgdXNlUmVmIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBNYXBDb250YWluZXIsIFRpbGVMYXllciwgSW1hZ2VPdmVybGF5IH0gZnJvbSBcInJlYWN0LWxlYWZsZXRcIjtcbmltcG9ydCBcImxlYWZsZXQvZGlzdC9sZWFmbGV0LmNzc1wiO1xuaW1wb3J0IHsgU2xpZGVyIH0gZnJvbSBcIkBtdWkvbWF0ZXJpYWxcIjtcbmltcG9ydCB7IGZyb21BcnJheUJ1ZmZlciB9IGZyb20gXCJnZW90aWZmXCI7XG5pbXBvcnQgY2hyb21hIGZyb20gJ2Nocm9tYS1qcyc7XG5pbXBvcnQgeyB2YWx1ZXNUb05hbWVzIH0gZnJvbSAnQC90eXBlcy92YWx1ZXNUb05hbWVzJztcblxuY29uc3QgTGFuZEhpc3RvcnkgPSAoeyBsYXRpdHVkZSwgbG9uZ2l0dWRlIH0pID0+IHtcbiAgY29uc3QgbGF0ID0gcGFyc2VGbG9hdChsYXRpdHVkZSk7XG4gIGNvbnN0IGxuZyA9IHBhcnNlRmxvYXQobG9uZ2l0dWRlKTtcbiAgY29uc3Qgem9vbSA9IDE1O1xuXG4gIGNvbnN0IHJhc3RlckRhdGFDYWNoZSA9IHVzZVJlZigpO1xuICBjb25zdCBbeWVhciwgc2V0WWVhcl0gPSB1c2VTdGF0ZSgyMDE0KTtcbiAgY29uc3QgW3Jhc3RlckRhdGEsIHNldFJhc3RlckRhdGFdID0gdXNlU3RhdGUobnVsbCk7XG4gIGNvbnN0IFtpbWFnZUJvdW5kcywgc2V0SW1hZ2VCb3VuZHNdID0gdXNlU3RhdGUobnVsbCk7XG4gIGNvbnN0IFtzZWxlY3RlZENvbG9ycywgc2V0U2VsZWN0ZWRDb2xvcnNdID0gdXNlU3RhdGUoe30pO1xuXG4gIGNvbnN0IGNvbG9ycyA9IGNocm9tYS5zY2FsZSgnU2V0MycpLmNvbG9ycyhPYmplY3Qua2V5cyh2YWx1ZXNUb05hbWVzKS5sZW5ndGgpO1xuICAgIFxuICBjb25zdCBmZXRjaFJhc3RlckRhdGEgPSBhc3luYyAodXJsKSA9PiB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpOyAgICBcbiAgICBjb25zdCBhcnJheUJ1ZmZlciA9IGF3YWl0IHJlc3BvbnNlLmFycmF5QnVmZmVyKCk7ICAgIFxuICAgIGNvbnN0IHRpZmYgPSBhd2FpdCBmcm9tQXJyYXlCdWZmZXIoYXJyYXlCdWZmZXIpOyAgICBcbiAgICBjb25zdCBpbWFnZSA9IGF3YWl0IHRpZmYuZ2V0SW1hZ2UoKTsgICAgXG4gICAgY29uc3QgcmFzdGVyRGF0YSA9IGF3YWl0IGltYWdlLnJlYWRSYXN0ZXJzKCk7XG4gICAgY29uc3Qgd2lkdGggPSBpbWFnZS5nZXRXaWR0aCgpO1xuICAgIGNvbnN0IGhlaWdodCA9IGltYWdlLmdldEhlaWdodCgpO1xuICAgIGNvbnN0IGJib3ggPSBpbWFnZS5nZXRCb3VuZGluZ0JveCgpXG5cbiAgICByZXR1cm4ge3Jhc3RlckRhdGEsIHdpZHRoLCBoZWlnaHQsIGJib3h9O1xuICB9O1xuICAgIFxuICBjb25zdCByYXN0ZXJUb0ltYWdlVVJMID0gKHJhc3RlckRhdGEsIHdpZHRoLCBoZWlnaHQpID0+IHtcbiAgICAvLyBDcmVhdGUgYSBoaWRkZW4gY2FudmFzIGVsZW1lbnRcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblxuICAgIGNvbnN0IGltYWdlRGF0YSA9IGN0eC5jcmVhdGVJbWFnZURhdGEod2lkdGgsIGhlaWdodCk7XG4gICAgICBcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhc3RlckRhdGFbMF0ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gcmFzdGVyRGF0YVswXVtpXTtcbiAgICAgIGNvbnN0IGluZGV4ID0gT2JqZWN0LmtleXModmFsdWVzVG9OYW1lcykuZmluZEluZGV4KChrZXkpID0+IHBhcnNlSW50KGtleSkgPT09IHZhbHVlKTtcbiAgICAgIGNvbnN0IGNvbG9yID0gaW5kZXggIT09IC0xID8gY2hyb21hKGNvbG9yc1tpbmRleF0pIDogY2hyb21hKCdibGFjaycpOyAgLy8gSGFuZGxlIG1pc3NpbmcgY29sb3JzXG4gICAgICBjb25zdCBbciwgZywgYl0gPSBjb2xvci5yZ2IoKTsgXG5cbiAgICAgIGxldCBhID0gMjU1O1xuICAgICAgaWYgKHZhbHVlID09IDAgfHwgdmFsdWUgPT0gMTApe1xuICAgICAgICBhID0gMDtcbiAgICAgIH1cbiAgICAgICAgXG4gICAgICBpbWFnZURhdGEuZGF0YVtpICogNF0gPSByO1xuICAgICAgaW1hZ2VEYXRhLmRhdGFbaSAqIDQgKyAxXSA9IGc7XG4gICAgICBpbWFnZURhdGEuZGF0YVtpICogNCArIDJdID0gYjtcbiAgICAgIGltYWdlRGF0YS5kYXRhW2kgKiA0ICsgM10gPSBhO1xuICAgIH1cbiAgICAgIFxuICAgIGN0eC5wdXRJbWFnZURhdGEoaW1hZ2VEYXRhLCAwLCAwKTtcblxuICAgIHJldHVybiBjYW52YXMudG9EYXRhVVJMKCk7XG4gIH07XG4gICAgXG5cbiAgLy8gRmV0Y2ggcmFzdGVyIGRhdGEgZm9yIGFsbCB5ZWFycyBvbiBtb3VudFxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGZldGNoQWxsUmFzdGVyRGF0YSA9IGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHllYXJzID0gWzIwMTQsIDIwMTUsIDIwMTYsIDIwMTcsIDIwMTgsIDIwMTksIDIwMjAsIDIwMjFdO1xuICAgICAgY29uc3QgcmFzdGVyRGF0YUZvclllYXJzID0ge307XG5cbiAgICAgIGZvciAoY29uc3QgeXIgb2YgeWVhcnMpIHtcbiAgICAgICAgY29uc3QgcmFzdGVyRmlsZSA9IGAvZGVtby9sYW5kX2hpc3RvcnkvcHJpb3JfaW52ZW50b3J5LyR7eXJ9LnRpZmA7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBmZXRjaFJhc3RlckRhdGEocmFzdGVyRmlsZSk7XG4gICAgICAgIHJhc3RlckRhdGFGb3JZZWFyc1t5cl0gPSBkYXRhO1xuICAgICAgfVxuXG4gICAgICAvLyBTdG9yZSBhbGwgZmV0Y2hlZCBkYXRhIGluIGNhY2hlXG4gICAgICByYXN0ZXJEYXRhQ2FjaGUuY3VycmVudCA9IHJhc3RlckRhdGFGb3JZZWFycztcblxuICAgICAgLy8gU2V0IGluaXRpYWwgeWVhciBkYXRhXG4gICAgICBjb25zdCByZCA9IHJhc3RlckRhdGFGb3JZZWFyc1t5ZWFyXS5yYXN0ZXJEYXRhO1xuICAgICAgY29uc3QgdyA9IHJhc3RlckRhdGFGb3JZZWFyc1t5ZWFyXS53aWR0aDtcbiAgICAgIGNvbnN0IGggPSByYXN0ZXJEYXRhRm9yWWVhcnNbeWVhcl0uaGVpZ2h0O1xuICAgICAgY29uc3QgYiA9IHJhc3RlckRhdGFGb3JZZWFyc1t5ZWFyXS5iYm94O1xuICAgICAgc2V0UmFzdGVyRGF0YShyYXN0ZXJUb0ltYWdlVVJMKHJkLCB3LCBoKSk7XG4gICAgICBzZXRJbWFnZUJvdW5kcyhiKTtcbiAgICAgIHVwZGF0ZUxlZ2VuZChyZCk7XG4gICAgfTtcblxuICAgIGZldGNoQWxsUmFzdGVyRGF0YSgpO1xuICB9LCBbXSk7XG5cbiAgLy8gVXBkYXRlIG1hcCBhbmQgbGVnZW5kIHdoZW4gdGhlIHllYXIgaXMgY2hhbmdlZFxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChyYXN0ZXJEYXRhQ2FjaGUuY3VycmVudCAmJiByYXN0ZXJEYXRhQ2FjaGUuY3VycmVudFt5ZWFyXSkge1xuICAgICAgY29uc3QgeyByYXN0ZXJEYXRhLCB3aWR0aCwgaGVpZ2h0LCBiYm94IH0gPSByYXN0ZXJEYXRhQ2FjaGUuY3VycmVudFt5ZWFyXTtcbiAgICAgIGNvbnN0IGltYWdlVXJsID0gcmFzdGVyVG9JbWFnZVVSTChyYXN0ZXJEYXRhLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgXG4gICAgICBzZXRSYXN0ZXJEYXRhKGltYWdlVXJsKTtcbiAgICAgIHNldEltYWdlQm91bmRzKGJib3gpO1xuICAgICAgdXBkYXRlTGVnZW5kKHJhc3RlckRhdGEpO1xuICAgIH1cbiAgfSwgW3llYXJdKTtcbiAgXG4gIGNvbnN0IHVwZGF0ZUxlZ2VuZCA9IChkYXRhKSA9PiB7ICBcbiAgICBjb25zdCBmbGF0RGF0YSA9IGRhdGE7XG4gICAgY29uc3QgdW5pcXVlRWxlbWVudHMgPSBuZXcgU2V0KGZsYXREYXRhKTtcbiAgICBjb25zdCBuZXdTZWxlY3RlZENvbG9ycyA9IHt9O1xuICBcbiAgICB1bmlxdWVFbGVtZW50cy5mb3JFYWNoKCh2YWx1ZSkgPT4ge1xuICAgICAgY29uc3QgbmFtZSA9IHZhbHVlc1RvTmFtZXNbdmFsdWVdO1xuICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSBPYmplY3Qua2V5cyh2YWx1ZXNUb05hbWVzKS5maW5kSW5kZXgoKGtleSkgPT4gcGFyc2VJbnQoa2V5KSA9PT0gdmFsdWUpO1xuICAgICAgICBuZXdTZWxlY3RlZENvbG9yc1tuYW1lXSA9IGNvbG9yc1tpbmRleF07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zXG4gICAgICBcbiAgICBzZXRTZWxlY3RlZENvbG9ycyhuZXdTZWxlY3RlZENvbG9ycyk7XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlWWVhckNoYW5nZSA9IChldmVudCwgbmV3VmFsdWUpID0+IHtcbiAgICBzZXRZZWFyKG5ld1ZhbHVlKTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwibGFuZC1oaXN0b3J5LWNvbnRhaW5lclwiPlxuICAgICAgPGRpdiBjbGFzc05hbWUgPSBcImZsZXgganVzdGlmeS1jZW50ZXIgaXRlbXMtbGVmdFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZSA9IFwibXItNFwiPlNlbGVjdCBUaGUgWWVhcjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRyb2xzIHctMzJcIj5cbiAgICAgICAgICA8U2xpZGVyXG4gICAgICAgICAgICB2YWx1ZT17eWVhcn1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVZZWFyQ2hhbmdlfVxuICAgICAgICAgICAgbWluPXsyMDE0fVxuICAgICAgICAgICAgbWF4PXsyMDIxfVxuICAgICAgICAgICAgc3RlcD17MX1cbiAgICAgICAgICAgIHZhbHVlTGFiZWxEaXNwbGF5PVwiYXV0b1wiXG4gICAgICAgICAgICBtYXJrc1xuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PiAgICBcbiAgICAgIDwvZGl2PlxuXG5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWFwLWFuZC1sZWdlbmRcIj5cbiAgICAgICAgey8qIExlYWZsZXQgTWFwICovfVxuICAgICAgICA8TWFwQ29udGFpbmVyXG4gICAgICAgICAgY2VudGVyPXtbbGF0LCBsbmddfVxuICAgICAgICAgIHpvb209e3pvb219XG4gICAgICAgICAgc3R5bGU9e3sgaGVpZ2h0OiBcIjQwMHB4XCIsIHdpZHRoOiBcIjEwMCVcIiB9fVxuICAgICAgICA+XG4gICAgICAgICAgPFRpbGVMYXllclxuICAgICAgICAgICAgYXR0cmlidXRpb249JyZjb3B5OyA8YSBocmVmPVwiaHR0cHM6Ly93d3cub3BlbnN0cmVldG1hcC5vcmcvY29weXJpZ2h0XCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzJ1xuICAgICAgICAgICAgdXJsPVwiaHR0cHM6Ly97c30udGlsZS5vcGVuc3RyZWV0bWFwLm9yZy97en0ve3h9L3t5fS5wbmdcIlxuICAgICAgICAgIC8+XG4gICAgICAgICAge3Jhc3RlckRhdGEgJiYgKFxuICAgICAgICAgICAgPEltYWdlT3ZlcmxheVxuICAgICAgICAgICAgICB1cmw9e3Jhc3RlckRhdGF9IFxuICAgICAgICAgICAgICBib3VuZHM9e1tbaW1hZ2VCb3VuZHNbMV0sIGltYWdlQm91bmRzWzBdXSwgW2ltYWdlQm91bmRzWzNdLCBpbWFnZUJvdW5kc1syXV1dfVxuICAgICAgICAgICAgICBvcGFjaXR5PXswLjd9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvTWFwQ29udGFpbmVyPlxuXG4gICAgICAgIHsvKiBMZWdlbmQgKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGVnZW5kXCI+XG4gICAgICAgICAgPGgzPkxlZ2VuZDwvaDM+XG4gICAgICAgICAge09iamVjdC5rZXlzKHNlbGVjdGVkQ29sb3JzKS5tYXAoKGtleSkgPT4gKFxuICAgICAgICAgICAgPGRpdiBrZXk9e2tleX0gY2xhc3NOYW1lPVwibGVnZW5kLWl0ZW1cIj5cbiAgICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJsZWdlbmQtY29sb3JcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IGJhY2tncm91bmRDb2xvcjogc2VsZWN0ZWRDb2xvcnNba2V5XSB9fVxuICAgICAgICAgICAgICA+PC9zcGFuPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJsZWdlbmQtbGFiZWxcIj57a2V5fTwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICkpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8c3R5bGUganN4PntgXG4gICAgICAgIC5sYW5kLWhpc3RvcnktY29udGFpbmVyIHtcbiAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgfVxuICAgICAgICAuY29udHJvbHMge1xuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDIwcHg7XG4gICAgICAgIH1cbiAgICAgICAgLm1hcC1hbmQtbGVnZW5kIHtcbiAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICB9XG4gICAgICAgIC5sZWdlbmQge1xuICAgICAgICAgIG1hcmdpbi1sZWZ0OiAyMHB4O1xuICAgICAgICB9XG4gICAgICAgIC5sZWdlbmQtaXRlbSB7XG4gICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDVweDtcbiAgICAgICAgfVxuICAgICAgICAubGVnZW5kLWNvbG9yIHtcbiAgICAgICAgICB3aWR0aDogMjBweDtcbiAgICAgICAgICBoZWlnaHQ6IDIwcHg7XG4gICAgICAgICAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xuICAgICAgICB9XG4gICAgICBgfVxuICAgICAgPC9zdHlsZT5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IExhbmRIaXN0b3J5O1xuIl0sIm5hbWVzIjpbInVzZUVmZmVjdCIsInVzZVN0YXRlIiwidXNlUmVmIiwiTWFwQ29udGFpbmVyIiwiVGlsZUxheWVyIiwiSW1hZ2VPdmVybGF5IiwiU2xpZGVyIiwiZnJvbUFycmF5QnVmZmVyIiwiY2hyb21hIiwidmFsdWVzVG9OYW1lcyIsIkxhbmRIaXN0b3J5IiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJsYXQiLCJwYXJzZUZsb2F0IiwibG5nIiwiem9vbSIsInJhc3RlckRhdGFDYWNoZSIsInllYXIiLCJzZXRZZWFyIiwicmFzdGVyRGF0YSIsInNldFJhc3RlckRhdGEiLCJpbWFnZUJvdW5kcyIsInNldEltYWdlQm91bmRzIiwic2VsZWN0ZWRDb2xvcnMiLCJzZXRTZWxlY3RlZENvbG9ycyIsImNvbG9ycyIsInNjYWxlIiwiT2JqZWN0Iiwia2V5cyIsImxlbmd0aCIsImZldGNoUmFzdGVyRGF0YSIsInVybCIsInJlc3BvbnNlIiwiZmV0Y2giLCJhcnJheUJ1ZmZlciIsInRpZmYiLCJpbWFnZSIsImdldEltYWdlIiwicmVhZFJhc3RlcnMiLCJ3aWR0aCIsImdldFdpZHRoIiwiaGVpZ2h0IiwiZ2V0SGVpZ2h0IiwiYmJveCIsImdldEJvdW5kaW5nQm94IiwicmFzdGVyVG9JbWFnZVVSTCIsImNhbnZhcyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImN0eCIsImdldENvbnRleHQiLCJpbWFnZURhdGEiLCJjcmVhdGVJbWFnZURhdGEiLCJpIiwidmFsdWUiLCJpbmRleCIsImZpbmRJbmRleCIsImtleSIsInBhcnNlSW50IiwiY29sb3IiLCJyIiwiZyIsImIiLCJyZ2IiLCJhIiwiZGF0YSIsInB1dEltYWdlRGF0YSIsInRvRGF0YVVSTCIsImZldGNoQWxsUmFzdGVyRGF0YSIsInllYXJzIiwicmFzdGVyRGF0YUZvclllYXJzIiwieXIiLCJyYXN0ZXJGaWxlIiwiY3VycmVudCIsInJkIiwidyIsImgiLCJ1cGRhdGVMZWdlbmQiLCJpbWFnZVVybCIsImZsYXREYXRhIiwidW5pcXVlRWxlbWVudHMiLCJTZXQiLCJuZXdTZWxlY3RlZENvbG9ycyIsImZvckVhY2giLCJuYW1lIiwiY29ucyIsImhhbmRsZVllYXJDaGFuZ2UiLCJldmVudCIsIm5ld1ZhbHVlIiwiZGl2Iiwib25DaGFuZ2UiLCJtaW4iLCJtYXgiLCJzdGVwIiwidmFsdWVMYWJlbERpc3BsYXkiLCJtYXJrcyIsImNlbnRlciIsInN0eWxlIiwiYXR0cmlidXRpb24iLCJib3VuZHMiLCJvcGFjaXR5IiwiaDMiLCJtYXAiLCJzcGFuIiwiYmFja2dyb3VuZENvbG9yIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./components/LandHistory.tsx\n"));

/***/ })

});