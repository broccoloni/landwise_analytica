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

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react_leaflet__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-leaflet */ \"(app-pages-browser)/./node_modules/react-leaflet/lib/MapContainer.js\");\n/* harmony import */ var react_leaflet__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-leaflet */ \"(app-pages-browser)/./node_modules/react-leaflet/lib/TileLayer.js\");\n/* harmony import */ var react_leaflet__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-leaflet */ \"(app-pages-browser)/./node_modules/react-leaflet/lib/ImageOverlay.js\");\n/* harmony import */ var leaflet_dist_leaflet_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! leaflet/dist/leaflet.css */ \"(app-pages-browser)/./node_modules/leaflet/dist/leaflet.css\");\n/* harmony import */ var _barrel_optimize_names_Slider_mui_material__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! __barrel_optimize__?names=Slider!=!@mui/material */ \"(app-pages-browser)/./node_modules/@mui/material/Slider/Slider.js\");\n/* harmony import */ var geotiff__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! geotiff */ \"(app-pages-browser)/./node_modules/geotiff/dist-module/geotiff.js\");\n/* harmony import */ var chroma_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! chroma-js */ \"(app-pages-browser)/./node_modules/chroma-js/chroma.js\");\n/* harmony import */ var chroma_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(chroma_js__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _types_valuesToNames__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/types/valuesToNames */ \"(app-pages-browser)/./types/valuesToNames.ts\");\n\nvar _s = $RefreshSig$();\n\n\n\n\n\n\n\nconst colors = chroma_js__WEBPACK_IMPORTED_MODULE_3___default().scale(\"Set3\").colors(Object.keys(_types_valuesToNames__WEBPACK_IMPORTED_MODULE_4__.valuesToNames).length);\nconst fetchRasterData = async (url)=>{\n    const response = await fetch(url);\n    const arrayBuffer = await response.arrayBuffer();\n    const tiff = await (0,geotiff__WEBPACK_IMPORTED_MODULE_5__.fromArrayBuffer)(arrayBuffer);\n    const image = await tiff.getImage();\n    const rasterData = await image.readRasters();\n    const width = image.getWidth();\n    const height = image.getHeight();\n    return {\n        rasterData,\n        width,\n        height\n    };\n};\nconst rasterToImageURL = (rasterData, width, height)=>{\n    // Create a hidden canvas element\n    const canvas = document.createElement(\"canvas\");\n    canvas.width = width;\n    canvas.height = height;\n    const ctx = canvas.getContext(\"2d\");\n    const imageData = ctx.createImageData(width, height);\n    for(let i = 0; i < rasterData.length; i++){\n        const value = rasterData[i];\n        const index = Object.keys(_types_valuesToNames__WEBPACK_IMPORTED_MODULE_4__.valuesToNames).findIndex((key)=>parseInt(key) === value);\n        const color = index !== -1 ? colors[index] : chroma_js__WEBPACK_IMPORTED_MODULE_3___default()(\"black\"); // Handle missing colors\n        const [r, g, b] = color.rgb();\n        imageData.data[i * 4] = r;\n        imageData.data[i * 4 + 1] = g;\n        imageData.data[i * 4 + 2] = b;\n        imageData.data[i * 4 + 3] = 255; // Alpha channel, fully opaque\n    }\n    ctx.putImageData(imageData, 0, 0);\n    return canvas.toDataURL();\n};\nconst LandHistory = (param)=>{\n    let { latitude, longitude } = param;\n    _s();\n    const lat = parseFloat(latitude);\n    const lng = parseFloat(longitude);\n    const zoom = 14;\n    const rasterDataCache = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)();\n    const [year, setYear] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(2014);\n    const [rasterData, setRasterData] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [selectedColors, setSelectedColors] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({});\n    // Fetch raster data for all years on mount\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        const fetchAllRasterData = async ()=>{\n            const years = [\n                2014,\n                2015,\n                2016,\n                2017,\n                2018,\n                2019,\n                2020,\n                2021\n            ];\n            const rasterDataForYears = {};\n            for (const yr of years){\n                const rasterFile = \"/demo/land_history/prior_inventory/\".concat(yr, \".tif\");\n                const data = await fetchRasterData(rasterFile);\n                rasterDataForYears[yr] = data;\n            }\n            // Store all fetched data in cache\n            rasterDataCache.current = rasterDataForYears;\n            // Set initial year data\n            setRasterData(rasterDataForYears[year]);\n            updateLegend(rasterDataForYears[year].rasterData);\n        };\n        fetchAllRasterData();\n    }, []);\n    // Update map and legend when the year is changed\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        if (rasterDataCache.current && rasterDataCache.current[year]) {\n            const { rasterData, width, height } = rasterDataCache.current[year];\n            const imageUrl = rasterToImageURL(rasterData, width, height);\n            console.log(\"Raster data:\", rasterData);\n            console.log(\"HW:\", width, height);\n            console.log(\"ImageURL:\", imageUrl);\n            setRasterData(imageUrl);\n            updateLegend(rasterData);\n        }\n    }, [\n        year\n    ]);\n    const updateLegend = (data)=>{\n        console.log(\"legend data:\", data);\n        const flatData = data;\n        const uniqueElements = new Set(flatData);\n        const newSelectedColors = {};\n        uniqueElements.forEach((value)=>{\n            const name = _types_valuesToNames__WEBPACK_IMPORTED_MODULE_4__.valuesToNames[value];\n            if (name) {\n                const index = Object.keys(_types_valuesToNames__WEBPACK_IMPORTED_MODULE_4__.valuesToNames).findIndex((key)=>parseInt(key) === value);\n                newSelectedColors[name] = colors[index];\n            }\n        });\n        setSelectedColors(newSelectedColors);\n    };\n    const handleYearChange = (event, newValue)=>{\n        setYear(newValue);\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"land-history-container\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"flex items-center\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"mr-4\",\n                        children: \"Select The Year\"\n                    }, void 0, false, {\n                        fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                        lineNumber: 122,\n                        columnNumber: 9\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"controls w-16\",\n                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_Slider_mui_material__WEBPACK_IMPORTED_MODULE_6__[\"default\"], {\n                            value: year,\n                            onChange: handleYearChange,\n                            min: 2014,\n                            max: 2021,\n                            step: 1,\n                            valueLabelDisplay: \"auto\",\n                            marks: true\n                        }, void 0, false, {\n                            fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                            lineNumber: 124,\n                            columnNumber: 11\n                        }, undefined)\n                    }, void 0, false, {\n                        fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                        lineNumber: 123,\n                        columnNumber: 9\n                    }, undefined)\n                ]\n            }, void 0, true, {\n                fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                lineNumber: 121,\n                columnNumber: 7\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"map-and-legend\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_leaflet__WEBPACK_IMPORTED_MODULE_7__.MapContainer, {\n                        center: [\n                            lat,\n                            lng\n                        ],\n                        zoom: zoom,\n                        style: {\n                            height: \"400px\",\n                            width: \"100%\"\n                        },\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_leaflet__WEBPACK_IMPORTED_MODULE_8__.TileLayer, {\n                                attribution: '\\xa9 <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',\n                                url: \"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png\"\n                            }, void 0, false, {\n                                fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                                lineNumber: 144,\n                                columnNumber: 11\n                            }, undefined),\n                            rasterData && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_leaflet__WEBPACK_IMPORTED_MODULE_9__.ImageOverlay, {\n                                url: rasterData,\n                                bounds: [\n                                    [\n                                        lat - 0.01,\n                                        lng - 0.01\n                                    ],\n                                    [\n                                        lat + 0.01,\n                                        lng + 0.01\n                                    ]\n                                ],\n                                opacity: 0.7\n                            }, void 0, false, {\n                                fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                                lineNumber: 149,\n                                columnNumber: 13\n                            }, undefined)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                        lineNumber: 139,\n                        columnNumber: 9\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"legend\",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h3\", {\n                                children: \"Legend\"\n                            }, void 0, false, {\n                                fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                                lineNumber: 159,\n                                columnNumber: 11\n                            }, undefined),\n                            Object.keys(selectedColors).map((key)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                    className: \"legend-item\",\n                                    children: [\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                            className: \"legend-color\",\n                                            style: {\n                                                backgroundColor: selectedColors[key]\n                                            }\n                                        }, void 0, false, {\n                                            fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                                            lineNumber: 162,\n                                            columnNumber: 15\n                                        }, undefined),\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                            className: \"legend-label\",\n                                            children: key\n                                        }, void 0, false, {\n                                            fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                                            lineNumber: 166,\n                                            columnNumber: 15\n                                        }, undefined)\n                                    ]\n                                }, key, true, {\n                                    fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                                    lineNumber: 161,\n                                    columnNumber: 13\n                                }, undefined))\n                        ]\n                    }, void 0, true, {\n                        fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                        lineNumber: 158,\n                        columnNumber: 9\n                    }, undefined)\n                ]\n            }, void 0, true, {\n                fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n                lineNumber: 137,\n                columnNumber: 7\n            }, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"/home/liamgraham123/landwise_analytica/landwise-dashboard/components/LandHistory.tsx\",\n        lineNumber: 120,\n        columnNumber: 5\n    }, undefined);\n};\n_s(LandHistory, \"/QuZkkWxsXFYP70nPa6ez65ZjOw=\");\n_c = LandHistory;\n/* harmony default export */ __webpack_exports__[\"default\"] = (LandHistory);\nvar _c;\n$RefreshReg$(_c, \"LandHistory\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2NvbXBvbmVudHMvTGFuZEhpc3RvcnkudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFvRDtBQUNrQjtBQUNwQztBQUNLO0FBQ0c7QUFDWDtBQUN1QjtBQUV0RCxNQUFNVSxTQUFTRixzREFBWSxDQUFDLFFBQVFFLE1BQU0sQ0FBQ0UsT0FBT0MsSUFBSSxDQUFDSiwrREFBYUEsRUFBRUssTUFBTTtBQUU1RSxNQUFNQyxrQkFBa0IsT0FBT0M7SUFDN0IsTUFBTUMsV0FBVyxNQUFNQyxNQUFNRjtJQUM3QixNQUFNRyxjQUFjLE1BQU1GLFNBQVNFLFdBQVc7SUFDOUMsTUFBTUMsT0FBTyxNQUFNYix3REFBZUEsQ0FBQ1k7SUFDbkMsTUFBTUUsUUFBUSxNQUFNRCxLQUFLRSxRQUFRO0lBQ2pDLE1BQU1DLGFBQWEsTUFBTUYsTUFBTUcsV0FBVztJQUMxQyxNQUFNQyxRQUFRSixNQUFNSyxRQUFRO0lBQzVCLE1BQU1DLFNBQVNOLE1BQU1PLFNBQVM7SUFFOUIsT0FBTztRQUFDTDtRQUFZRTtRQUFPRTtJQUFNO0FBQ25DO0FBRUEsTUFBTUUsbUJBQW1CLENBQUNOLFlBQVlFLE9BQU9FO0lBQzNDLGlDQUFpQztJQUNqQyxNQUFNRyxTQUFTQyxTQUFTQyxhQUFhLENBQUM7SUFDdENGLE9BQU9MLEtBQUssR0FBR0E7SUFDZkssT0FBT0gsTUFBTSxHQUFHQTtJQUNoQixNQUFNTSxNQUFNSCxPQUFPSSxVQUFVLENBQUM7SUFFOUIsTUFBTUMsWUFBWUYsSUFBSUcsZUFBZSxDQUFDWCxPQUFPRTtJQUU3QyxJQUFLLElBQUlVLElBQUksR0FBR0EsSUFBSWQsV0FBV1QsTUFBTSxFQUFFdUIsSUFBSztRQUMxQyxNQUFNQyxRQUFRZixVQUFVLENBQUNjLEVBQUU7UUFDM0IsTUFBTUUsUUFBUTNCLE9BQU9DLElBQUksQ0FBQ0osK0RBQWFBLEVBQUUrQixTQUFTLENBQUMsQ0FBQ0MsTUFBUUMsU0FBU0QsU0FBU0g7UUFDOUUsTUFBTUss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QUNyQixJQUFJOzRDQUFDOzs7Ozs7c0RBRWhELDhEQUFDeUQ7NENBQUtkLFdBQVU7c0RBQWdCM0M7Ozs7Ozs7bUNBTHhCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFZdEI7R0EzSE1VO0tBQUFBO0FBNkhOLCtEQUFlQSxXQUFXQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL2NvbXBvbmVudHMvTGFuZEhpc3RvcnkudHN4P2VlYjMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSwgdXNlUmVmIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBNYXBDb250YWluZXIsIFRpbGVMYXllciwgSW1hZ2VPdmVybGF5IH0gZnJvbSBcInJlYWN0LWxlYWZsZXRcIjtcbmltcG9ydCBcImxlYWZsZXQvZGlzdC9sZWFmbGV0LmNzc1wiO1xuaW1wb3J0IHsgU2xpZGVyIH0gZnJvbSBcIkBtdWkvbWF0ZXJpYWxcIjtcbmltcG9ydCB7IGZyb21BcnJheUJ1ZmZlciB9IGZyb20gXCJnZW90aWZmXCI7XG5pbXBvcnQgY2hyb21hIGZyb20gJ2Nocm9tYS1qcyc7XG5pbXBvcnQgeyB2YWx1ZXNUb05hbWVzIH0gZnJvbSAnQC90eXBlcy92YWx1ZXNUb05hbWVzJztcblxuY29uc3QgY29sb3JzID0gY2hyb21hLnNjYWxlKCdTZXQzJykuY29sb3JzKE9iamVjdC5rZXlzKHZhbHVlc1RvTmFtZXMpLmxlbmd0aCk7XG5cbmNvbnN0IGZldGNoUmFzdGVyRGF0YSA9IGFzeW5jICh1cmwpID0+IHtcbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpOyAgICBcbiAgY29uc3QgYXJyYXlCdWZmZXIgPSBhd2FpdCByZXNwb25zZS5hcnJheUJ1ZmZlcigpOyAgICBcbiAgY29uc3QgdGlmZiA9IGF3YWl0IGZyb21BcnJheUJ1ZmZlcihhcnJheUJ1ZmZlcik7ICAgIFxuICBjb25zdCBpbWFnZSA9IGF3YWl0IHRpZmYuZ2V0SW1hZ2UoKTsgICAgXG4gIGNvbnN0IHJhc3RlckRhdGEgPSBhd2FpdCBpbWFnZS5yZWFkUmFzdGVycygpO1xuICBjb25zdCB3aWR0aCA9IGltYWdlLmdldFdpZHRoKCk7XG4gIGNvbnN0IGhlaWdodCA9IGltYWdlLmdldEhlaWdodCgpO1xuXG4gIHJldHVybiB7cmFzdGVyRGF0YSwgd2lkdGgsIGhlaWdodH07XG59O1xuXG5jb25zdCByYXN0ZXJUb0ltYWdlVVJMID0gKHJhc3RlckRhdGEsIHdpZHRoLCBoZWlnaHQpID0+IHtcbiAgLy8gQ3JlYXRlIGEgaGlkZGVuIGNhbnZhcyBlbGVtZW50XG4gIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG4gIGNvbnN0IGltYWdlRGF0YSA9IGN0eC5jcmVhdGVJbWFnZURhdGEod2lkdGgsIGhlaWdodCk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCByYXN0ZXJEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgdmFsdWUgPSByYXN0ZXJEYXRhW2ldO1xuICAgIGNvbnN0IGluZGV4ID0gT2JqZWN0LmtleXModmFsdWVzVG9OYW1lcykuZmluZEluZGV4KChrZXkpID0+IHBhcnNlSW50KGtleSkgPT09IHZhbHVlKTtcbiAgICBjb25zdCBjb2xvciA9IGluZGV4ICE9PSAtMSA/IGNvbG9yc1tpbmRleF0gOiBjaHJvbWEoJ2JsYWNrJyk7ICAvLyBIYW5kbGUgbWlzc2luZyBjb2xvcnNcbiAgICBjb25zdCBbciwgZywgYl0gPSBjb2xvci5yZ2IoKTsgXG5cbiAgICBpbWFnZURhdGEuZGF0YVtpICogNF0gPSByO1xuICAgIGltYWdlRGF0YS5kYXRhW2kgKiA0ICsgMV0gPSBnO1xuICAgIGltYWdlRGF0YS5kYXRhW2kgKiA0ICsgMl0gPSBiO1xuICAgIGltYWdlRGF0YS5kYXRhW2kgKiA0ICsgM10gPSAyNTU7IC8vIEFscGhhIGNoYW5uZWwsIGZ1bGx5IG9wYXF1ZVxuICB9XG5cbiAgY3R4LnB1dEltYWdlRGF0YShpbWFnZURhdGEsIDAsIDApO1xuXG4gIHJldHVybiBjYW52YXMudG9EYXRhVVJMKCk7XG59O1xuXG5cbmNvbnN0IExhbmRIaXN0b3J5ID0gKHsgbGF0aXR1ZGUsIGxvbmdpdHVkZSB9KSA9PiB7XG4gIGNvbnN0IGxhdCA9IHBhcnNlRmxvYXQobGF0aXR1ZGUpO1xuICBjb25zdCBsbmcgPSBwYXJzZUZsb2F0KGxvbmdpdHVkZSk7XG4gIGNvbnN0IHpvb20gPSAxNDtcblxuICBjb25zdCByYXN0ZXJEYXRhQ2FjaGUgPSB1c2VSZWYoKTtcbiAgY29uc3QgW3llYXIsIHNldFllYXJdID0gdXNlU3RhdGUoMjAxNCk7XG4gIGNvbnN0IFtyYXN0ZXJEYXRhLCBzZXRSYXN0ZXJEYXRhXSA9IHVzZVN0YXRlKG51bGwpO1xuICBjb25zdCBbc2VsZWN0ZWRDb2xvcnMsIHNldFNlbGVjdGVkQ29sb3JzXSA9IHVzZVN0YXRlKHt9KTtcblxuICAvLyBGZXRjaCByYXN0ZXIgZGF0YSBmb3IgYWxsIHllYXJzIG9uIG1vdW50XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgZmV0Y2hBbGxSYXN0ZXJEYXRhID0gYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgeWVhcnMgPSBbMjAxNCwgMjAxNSwgMjAxNiwgMjAxNywgMjAxOCwgMjAxOSwgMjAyMCwgMjAyMV07XG4gICAgICBjb25zdCByYXN0ZXJEYXRhRm9yWWVhcnMgPSB7fTtcblxuICAgICAgZm9yIChjb25zdCB5ciBvZiB5ZWFycykge1xuICAgICAgICBjb25zdCByYXN0ZXJGaWxlID0gYC9kZW1vL2xhbmRfaGlzdG9yeS9wcmlvcl9pbnZlbnRvcnkvJHt5cn0udGlmYDtcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IGZldGNoUmFzdGVyRGF0YShyYXN0ZXJGaWxlKTtcbiAgICAgICAgcmFzdGVyRGF0YUZvclllYXJzW3lyXSA9IGRhdGE7XG4gICAgICB9XG5cbiAgICAgIC8vIFN0b3JlIGFsbCBmZXRjaGVkIGRhdGEgaW4gY2FjaGVcbiAgICAgIHJhc3RlckRhdGFDYWNoZS5jdXJyZW50ID0gcmFzdGVyRGF0YUZvclllYXJzO1xuXG4gICAgICAvLyBTZXQgaW5pdGlhbCB5ZWFyIGRhdGFcbiAgICAgIHNldFJhc3RlckRhdGEocmFzdGVyRGF0YUZvclllYXJzW3llYXJdKTtcbiAgICAgIHVwZGF0ZUxlZ2VuZChyYXN0ZXJEYXRhRm9yWWVhcnNbeWVhcl0ucmFzdGVyRGF0YSk7XG4gICAgfTtcblxuICAgIGZldGNoQWxsUmFzdGVyRGF0YSgpO1xuICB9LCBbXSk7XG5cbiAgLy8gVXBkYXRlIG1hcCBhbmQgbGVnZW5kIHdoZW4gdGhlIHllYXIgaXMgY2hhbmdlZFxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChyYXN0ZXJEYXRhQ2FjaGUuY3VycmVudCAmJiByYXN0ZXJEYXRhQ2FjaGUuY3VycmVudFt5ZWFyXSkge1xuICAgICAgY29uc3QgeyByYXN0ZXJEYXRhLCB3aWR0aCwgaGVpZ2h0IH0gPSByYXN0ZXJEYXRhQ2FjaGUuY3VycmVudFt5ZWFyXTtcbiAgICAgIGNvbnN0IGltYWdlVXJsID0gcmFzdGVyVG9JbWFnZVVSTChyYXN0ZXJEYXRhLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgY29uc29sZS5sb2coXCJSYXN0ZXIgZGF0YTpcIiwgcmFzdGVyRGF0YSk7XG4gICAgICBjb25zb2xlLmxvZyhcIkhXOlwiLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgIGNvbnNvbGUubG9nKFwiSW1hZ2VVUkw6XCIsIGltYWdlVXJsKTtcbiAgICAgICAgXG4gICAgICBzZXRSYXN0ZXJEYXRhKGltYWdlVXJsKTtcbiAgICAgIHVwZGF0ZUxlZ2VuZChyYXN0ZXJEYXRhKTtcbiAgICB9XG4gIH0sIFt5ZWFyXSk7XG4gIFxuICBjb25zdCB1cGRhdGVMZWdlbmQgPSAoZGF0YSkgPT4geyAgXG4gICAgY29uc29sZS5sb2coXCJsZWdlbmQgZGF0YTpcIiwgZGF0YSk7XG4gICAgY29uc3QgZmxhdERhdGEgPSBkYXRhO1xuICAgIGNvbnN0IHVuaXF1ZUVsZW1lbnRzID0gbmV3IFNldChmbGF0RGF0YSk7XG4gICAgY29uc3QgbmV3U2VsZWN0ZWRDb2xvcnMgPSB7fTtcbiAgXG4gICAgdW5pcXVlRWxlbWVudHMuZm9yRWFjaCgodmFsdWUpID0+IHtcbiAgICAgIGNvbnN0IG5hbWUgPSB2YWx1ZXNUb05hbWVzW3ZhbHVlXTtcbiAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gT2JqZWN0LmtleXModmFsdWVzVG9OYW1lcykuZmluZEluZGV4KChrZXkpID0+IHBhcnNlSW50KGtleSkgPT09IHZhbHVlKTtcbiAgICAgICAgbmV3U2VsZWN0ZWRDb2xvcnNbbmFtZV0gPSBjb2xvcnNbaW5kZXhdO1xuICAgICAgfVxuICAgIH0pO1xuICBcbiAgICBzZXRTZWxlY3RlZENvbG9ycyhuZXdTZWxlY3RlZENvbG9ycyk7XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlWWVhckNoYW5nZSA9IChldmVudCwgbmV3VmFsdWUpID0+IHtcbiAgICBzZXRZZWFyKG5ld1ZhbHVlKTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwibGFuZC1oaXN0b3J5LWNvbnRhaW5lclwiPlxuICAgICAgPGRpdiBjbGFzc05hbWUgPSBcImZsZXggaXRlbXMtY2VudGVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lID0gXCJtci00XCI+U2VsZWN0IFRoZSBZZWFyPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udHJvbHMgdy0xNlwiPlxuICAgICAgICAgIDxTbGlkZXJcbiAgICAgICAgICAgIHZhbHVlPXt5ZWFyfVxuICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZVllYXJDaGFuZ2V9XG4gICAgICAgICAgICBtaW49ezIwMTR9XG4gICAgICAgICAgICBtYXg9ezIwMjF9XG4gICAgICAgICAgICBzdGVwPXsxfVxuICAgICAgICAgICAgdmFsdWVMYWJlbERpc3BsYXk9XCJhdXRvXCJcbiAgICAgICAgICAgIG1hcmtzXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+ICAgIFxuICAgICAgPC9kaXY+XG5cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXAtYW5kLWxlZ2VuZFwiPlxuICAgICAgICB7LyogTGVhZmxldCBNYXAgKi99XG4gICAgICAgIDxNYXBDb250YWluZXJcbiAgICAgICAgICBjZW50ZXI9e1tsYXQsIGxuZ119XG4gICAgICAgICAgem9vbT17em9vbX1cbiAgICAgICAgICBzdHlsZT17eyBoZWlnaHQ6IFwiNDAwcHhcIiwgd2lkdGg6IFwiMTAwJVwiIH19XG4gICAgICAgID5cbiAgICAgICAgICA8VGlsZUxheWVyXG4gICAgICAgICAgICBhdHRyaWJ1dGlvbj0nJmNvcHk7IDxhIGhyZWY9XCJodHRwczovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnMnXG4gICAgICAgICAgICB1cmw9XCJodHRwczovL3tzfS50aWxlLm9wZW5zdHJlZXRtYXAub3JnL3t6fS97eH0ve3l9LnBuZ1wiXG4gICAgICAgICAgLz5cbiAgICAgICAgICB7cmFzdGVyRGF0YSAmJiAoXG4gICAgICAgICAgICA8SW1hZ2VPdmVybGF5XG4gICAgICAgICAgICAgIHVybD17cmFzdGVyRGF0YX0gXG4gICAgICAgICAgICAgIGJvdW5kcz17W1tsYXQgLSAwLjAxLCBsbmcgLSAwLjAxXSwgW2xhdCArIDAuMDEsIGxuZyArIDAuMDFdXX1cbiAgICAgICAgICAgICAgb3BhY2l0eT17MC43fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICA8L01hcENvbnRhaW5lcj5cblxuICAgICAgICB7LyogTGVnZW5kICovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxlZ2VuZFwiPlxuICAgICAgICAgIDxoMz5MZWdlbmQ8L2gzPlxuICAgICAgICAgIHtPYmplY3Qua2V5cyhzZWxlY3RlZENvbG9ycykubWFwKChrZXkpID0+IChcbiAgICAgICAgICAgIDxkaXYga2V5PXtrZXl9IGNsYXNzTmFtZT1cImxlZ2VuZC1pdGVtXCI+XG4gICAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibGVnZW5kLWNvbG9yXCJcbiAgICAgICAgICAgICAgICBzdHlsZT17eyBiYWNrZ3JvdW5kQ29sb3I6IHNlbGVjdGVkQ29sb3JzW2tleV0gfX1cbiAgICAgICAgICAgICAgPjwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibGVnZW5kLWxhYmVsXCI+e2tleX08L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IExhbmRIaXN0b3J5O1xuIl0sIm5hbWVzIjpbInVzZUVmZmVjdCIsInVzZVN0YXRlIiwidXNlUmVmIiwiTWFwQ29udGFpbmVyIiwiVGlsZUxheWVyIiwiSW1hZ2VPdmVybGF5IiwiU2xpZGVyIiwiZnJvbUFycmF5QnVmZmVyIiwiY2hyb21hIiwidmFsdWVzVG9OYW1lcyIsImNvbG9ycyIsInNjYWxlIiwiT2JqZWN0Iiwia2V5cyIsImxlbmd0aCIsImZldGNoUmFzdGVyRGF0YSIsInVybCIsInJlc3BvbnNlIiwiZmV0Y2giLCJhcnJheUJ1ZmZlciIsInRpZmYiLCJpbWFnZSIsImdldEltYWdlIiwicmFzdGVyRGF0YSIsInJlYWRSYXN0ZXJzIiwid2lkdGgiLCJnZXRXaWR0aCIsImhlaWdodCIsImdldEhlaWdodCIsInJhc3RlclRvSW1hZ2VVUkwiLCJjYW52YXMiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJjdHgiLCJnZXRDb250ZXh0IiwiaW1hZ2VEYXRhIiwiY3JlYXRlSW1hZ2VEYXRhIiwiaSIsInZhbHVlIiwiaW5kZXgiLCJmaW5kSW5kZXgiLCJrZXkiLCJwYXJzZUludCIsImNvbG9yIiwiciIsImciLCJiIiwicmdiIiwiZGF0YSIsInB1dEltYWdlRGF0YSIsInRvRGF0YVVSTCIsIkxhbmRIaXN0b3J5IiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJsYXQiLCJwYXJzZUZsb2F0IiwibG5nIiwiem9vbSIsInJhc3RlckRhdGFDYWNoZSIsInllYXIiLCJzZXRZZWFyIiwic2V0UmFzdGVyRGF0YSIsInNlbGVjdGVkQ29sb3JzIiwic2V0U2VsZWN0ZWRDb2xvcnMiLCJmZXRjaEFsbFJhc3RlckRhdGEiLCJ5ZWFycyIsInJhc3RlckRhdGFGb3JZZWFycyIsInlyIiwicmFzdGVyRmlsZSIsImN1cnJlbnQiLCJ1cGRhdGVMZWdlbmQiLCJpbWFnZVVybCIsImNvbnNvbGUiLCJsb2ciLCJmbGF0RGF0YSIsInVuaXF1ZUVsZW1lbnRzIiwiU2V0IiwibmV3U2VsZWN0ZWRDb2xvcnMiLCJmb3JFYWNoIiwibmFtZSIsImhhbmRsZVllYXJDaGFuZ2UiLCJldmVudCIsIm5ld1ZhbHVlIiwiZGl2IiwiY2xhc3NOYW1lIiwib25DaGFuZ2UiLCJtaW4iLCJtYXgiLCJzdGVwIiwidmFsdWVMYWJlbERpc3BsYXkiLCJtYXJrcyIsImNlbnRlciIsInN0eWxlIiwiYXR0cmlidXRpb24iLCJib3VuZHMiLCJvcGFjaXR5IiwiaDMiLCJtYXAiLCJzcGFuIiwiYmFja2dyb3VuZENvbG9yIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./components/LandHistory.tsx\n"));

/***/ })

});