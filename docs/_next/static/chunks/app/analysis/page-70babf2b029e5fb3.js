(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[490],{4474:function(e,a,t){Promise.resolve().then(t.bind(t,8333))},8333:function(e,a,t){"use strict";t.r(a),t.d(a,{default:function(){return L}});var s=t(7437),l=t(2265),r=e=>{let{children:a,className:t}=e;return(0,s.jsx)("div",{className:"bg-white ".concat(t," rounded-lg border p-8"),children:a})},n=t(8022),c=t.n(n),i=t(8693),o=t.n(i),d=t(9436),m=t.n(d),h=t(6463),x=t(223),u=t(8355),g=t.n(u),f=e=>{let{options:a,selected:t,onSelect:r}=e,[n,c]=(0,l.useState)(!1),i=(0,l.useRef)(null);return(0,l.useEffect)(()=>{let e=e=>{i.current&&!i.current.contains(e.target)&&c(!1)};return document.addEventListener("mousedown",e),()=>{document.removeEventListener("mousedown",e)}},[]),(0,s.jsxs)("div",{className:"relative inline-block z-100",ref:i,children:[(0,s.jsxs)("button",{onClick:()=>c(!n),className:"flex items-center p-2 bg-gray-200 text-black rounded focus:outline-none",children:[t,(0,s.jsx)("span",{className:"flex justify-center items-center ml-2 pl-2",children:(0,s.jsx)("span",{className:"w-0 h-0 border-l-4 border-l-transparent border-t-4 border-t-black border-r-4 border-r-transparent"})})]}),n&&(0,s.jsx)("ul",{className:"absolute z-10 min-w-24 bg-white border border-gray-300 rounded shadow-lg mt-1",children:a.map((e,t)=>(0,s.jsx)("li",{onClick:()=>{r(e),c(!1)},className:"p-2 cursor-pointer hover:bg-accent-medium hover:text-white border-b border-gray-300 ".concat(t===a.length-1?"border-b-0":""),children:e},e))})]})},b=t(647);let v=(0,b.default)(()=>Promise.all([t.e(934),t.e(8)]).then(t.bind(t,2008)),{loadableGenerated:{webpack:()=>[2008]},ssr:!1});function p(){let[e,a]=(0,l.useState)("Flaxseed"),[t,r]=(0,l.useState)([]);(0,l.useEffect)(()=>{(async()=>{let e=await fetch("/demo/trends/crop_yield_per_year.csv"),a=await e.text();r(g().parse(a,{header:!0,dynamicTyping:!0}).data)})()},[]);let n=t.filter(a=>a.Crop===e&&a.Year>=2014&&a.Year<=2034).filter(e=>["Property","Neighbourhood","National"].includes(e.levels)).reduce((e,a)=>{let t=e.findIndex(e=>e.name===a.levels);return -1!==t?(e[t].x.push(a.Year),e[t].y.push(a.Yield)):e.push({x:[a.Year],y:[a.Yield],name:a.levels,mode:"lines"}),e},[]);return(0,s.jsxs)("div",{className:"".concat(c().className," flex flex-col items-center"),children:[(0,s.jsxs)("div",{className:"flex items-center",children:[(0,s.jsx)("div",{className:"".concat(c().className," mr-2 mb-0"),children:"Estimated Historic & Projected Land Suitability of"}),(0,s.jsx)(f,{options:["Flaxseed","Wheat","Barley","Oats","Canola","Peas","Corn","Soy"],selected:e,onSelect:a})]}),n.length>0?(0,s.jsx)(v,{className:"mt-0",data:n,layout:{xaxis:{title:"Year"},yaxis:{title:"Estimated Land Suitability (Bushels/Acre)"},shapes:[{type:"line",x0:2024,x1:2024,y0:0,y1:1,xref:"x",yref:"paper",line:{color:"grey",dash:"dash"}}]}}):(0,s.jsx)("p",{children:"Loading data..."})]})}var j=t(8579),y=t.n(j);let N={0:"Cloud",10:"Cloud",20:"Water",30:"Barren",34:"Developed",35:"Greenhouses",50:"Shrubland",80:"Wetland",85:"Peatland",110:"Grassland",120:"Agriculture",122:"Flaxseed",130:"Too Wet",131:"Fallow",132:"Cereals",133:"Barley",134:"Mustard",135:"Millet",136:"Oats",137:"Rye",138:"Spelt",139:"Triticale",140:"Wheat",141:"Switchgrass",142:"Sorghum",143:"Quinoa",145:"Winter Wheat",146:"Spring Wheat",147:"Corn",148:"Tobacco",149:"Ginseng",150:"Oilseeds",151:"Borage",152:"Camelina",153:"Canola",154:"Flaxseed2",155:"Mustard",156:"Safflower",157:"Sunflower",158:"Soybeans",160:"Pulses",161:"Other Pulses",162:"Peas",163:"Chickpeas",167:"Beans",168:"Fababeans",174:"Lentils",175:"Vegetables",176:"Tomatoes",177:"Potatoes",178:"Sugarbeets",179:"Other Veg",180:"Fruits",181:"Berries",182:"Blueberry",183:"Cranberry",185:"Other Berry",188:"Orchards",189:"Other Fruits",190:"Vineyards",191:"Hops",192:"Sod",193:"Herbs",194:"Nursery",195:"Buckwheat",196:"Canaryseed",197:"Hemp",198:"Vetch",199:"Other Crops",200:"Forest",210:"Coniferous",220:"Broadleaf",230:"Mixedwood"};var w=t(2169),C=t(14),S=t(1976),F=t(2755),k=t(6648),E=t(7242);let{publicRuntimeConfig:P}=t.n(E)()(),{basePath:B}=P||{},O=(0,b.default)(()=>Promise.all([t.e(733),t.e(212),t.e(969)]).then(t.bind(t,1969)),{loadableGenerated:{webpack:()=>[1969]},ssr:!1}),W={address:"8159 Side Road 30, Wellington County, Ontario, N0B 2K0, Canada",lat:"43.6929954",lng:"-80.3071343"};function L(){var e;let a=(0,h.useRouter)(),[t,n]=(0,l.useState)(!1),[i,d]=(0,l.useState)(null),[u,g]=(0,l.useState)(null),[b,v]=(0,l.useState)(null);(0,l.useEffect)(()=>{let e=new URLSearchParams(window.location.search),a=e.get("address"),t=e.get("lat"),s=e.get("lng");d(a),g(t),v(s),a===W.address?n(!0):n(!1)},[]);let[j,E]=(0,l.useState)(2014),[P,L]=(0,l.useState)({}),I=y().scale("Set1").colors(Object.keys(N).length),R=P[j];(0,l.useEffect)(()=>{(async()=>{let e={};try{for(let a of[2014,2015,2016,2017,2018,2019,2020,2021]){let t="/demo/land_history/prior_inventory/".concat(a,".tif"),s=await _(t);e[a]=s}L(e)}catch(e){console.error("Error fetching raster data:",e)}})()},[]);let _=async e=>{let a=await fetch(e);if(!a.ok)throw Error("Failed to fetch ".concat(e));let t=await a.arrayBuffer(),s=await (0,w.go)(t),l=await s.getImage(),r=await l.readRasters(),n=A(r,l.getWidth(),l.getHeight()),c=new Set(Array.from(r[0])),i={};return c.forEach(e=>{let a=N[e];if(a&&"Cloud"!==a){let t=Object.keys(N).findIndex(a=>parseInt(a)===e);i[a]=I[t]}}),{imageUrl:n,legend:i,bbox:l.getBoundingBox()}},A=(e,a,t)=>{let s=document.createElement("canvas");s.width=a,s.height=t;let l=s.getContext("2d");if(!l)throw Error("Failed to get canvas 2D context");l.imageSmoothingEnabled=!1;let r=l.createImageData(a,t);for(let a=0;a<e[0].length;a++){let t=e[0][a],s=Object.keys(N).findIndex(e=>parseInt(e)===t),[l,n,c]=(-1!==s?y()(I[s]):y()("black")).rgb();r.data[4*a]=l,r.data[4*a+1]=n,r.data[4*a+2]=c,r.data[4*a+3]=0===t||10===t?0:255}l.putImageData(r,0,0);let n=document.createElement("canvas");n.width=10*a,n.height=10*t;let c=n.getContext("2d");if(!c)throw Error("Failed to get scaled canvas 2D context");return c.imageSmoothingEnabled=!1,c.drawImage(s,0,0,n.width,n.height),n.toDataURL()},D=["Flaxseed","Wheat","Barley","Oats","Canola","Peas","Corn","Soy"],[U,T]=(0,l.useState)(D[0]),[Y,G]=(0,l.useState)({}),M=["black","red","yellow","white"];(0,l.useEffect)(()=>{Promise.all(D.map(e=>new Promise((a,t)=>{let s=new Image;s.src="/demo/ag_tips/".concat(e,".png"),s.onload=()=>{let t=document.createElement("canvas"),l=t.getContext("2d");if(!l)throw Error("Failed to get canvas 2D context");t.width=s.width,t.height=s.height,l.drawImage(s,0,0);let r=l.getImageData(0,0,t.width,t.height);H(r.data),l.putImageData(r,0,0);let n=document.createElement("canvas");n.width=10*s.width,n.height=10*s.height;let c=n.getContext("2d");if(!c)throw Error("Failed to get scaled canvas 2D context");c.imageSmoothingEnabled=!1,c.drawImage(t,0,0,n.width,n.height);let i=n.toDataURL();G(a=>({...a,[e]:i})),a()},s.onerror=()=>{console.error("Failed to load image for ".concat(e)),t()}}))).catch(e=>console.error("Error preloading and processing images:",e))},[]);let H=e=>{let a=y().scale(M).correctLightness().domain([0,1]);for(let t=0;t<e.length;t+=4){let s=a((e[t]+e[t+1]+e[t+2])/3/255).rgb();e[t]=s[0],e[t+1]=s[1],e[t+2]=s[2]}},z={Flaxseed:{vmin:56,vmax:96},Wheat:{vmin:77,vmax:117},Barley:{vmin:61,vmax:101},Oats:{vmin:56,vmax:96},Canola:{vmin:43,vmax:83},Peas:{vmin:66,vmax:106},Corn:{vmin:63,vmax:103},Soy:{vmin:63,vmax:103}}[U];return(0,s.jsx)("div",{className:"".concat(c().className," bg-accent-light text-black"),children:(0,s.jsxs)("div",{className:"relative m-4",children:[(0,s.jsx)(r,{className:"mb-4",children:(0,s.jsxs)("section",{id:"property",children:[(0,s.jsx)("div",{className:"".concat(o().className," text-accent-dark text-2xl pb-2"),children:"Property"}),(0,s.jsxs)("div",{className:"sm:flex flex-row",children:[(0,s.jsxs)("div",{className:"w-full",children:[t?(0,s.jsx)("p",{className:"mb-2 text-accent text-xl text-center",children:"This is the demo address!"}):(0,s.jsx)("div",{className:"flex w-full justify-center",children:(0,s.jsx)("button",{className:"flex items-center p-2",onClick:()=>a.push("".concat(B,"/analysis?address=").concat(encodeURIComponent(W.address),"&lat=").concat(W.lat,"&lng=").concat(W.lng)),children:(0,s.jsxs)("div",{className:"flex bg-accent-medium text-white py-2 px-4 rounded-lg",children:[(0,s.jsx)("p",{className:"mr-2",children:"Please Use The Demo Address"}),(0,s.jsx)(S.Z,{})]})})}),(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)("p",{className:"mb-2",children:["Address: ",i]}),(0,s.jsxs)("p",{className:"mb-2",children:["Latitude: ",u]}),(0,s.jsxs)("p",{className:"mb-2",children:["Longitude: ",b]})]}),(0,s.jsx)("div",{className:"mt-8",children:(0,s.jsx)(x.Z,{onAddressSelect:(e,t,s)=>{a.push("".concat(B,"/analysis?address=").concat(encodeURIComponent(e),"&lat=").concat(t,"&lng=").concat(s))},prompt:"Search for a new address"})})]}),(0,s.jsx)("div",{className:"sm:ml-4 sm:mt-0 mt-4",children:(0,s.jsx)(k.default,{src:"/farm.png",alt:"Photo of Property",width:512,height:512,quality:50})})]})]})}),t&&(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(r,{className:"mb-4",children:(0,s.jsxs)("section",{id:"land-history",children:[(0,s.jsx)("div",{className:"".concat(o().className," text-accent-dark text-2xl pb-2"),children:"Historical Land Use"}),(0,s.jsxs)("div",{className:"flex justify-center items-left",children:[(0,s.jsx)("div",{className:"mr-4",children:"Select The Year"}),(0,s.jsx)("div",{className:"controls w-32",children:(0,s.jsx)(C.ZP,{value:j,onChange:(e,a)=>{Array.isArray(a)?E(a[0]):E(a)},min:2014,max:2021,step:1,valueLabelDisplay:"auto",marks:!0})})]}),(0,s.jsxs)("div",{className:"flex",children:[(0,s.jsx)("div",{className:"w-full",children:(null==R?void 0:R.bbox)&&(null==R?void 0:R.imageUrl)?(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(O,{latitude:u,longitude:b,zoom:15,bbox:R.bbox,imageUrl:R.imageUrl})}):(0,s.jsx)("div",{className:"text-center text-gray-500",children:"No map data available."})}),(0,s.jsx)("div",{className:"w-32 pl-4",children:(0,s.jsxs)("div",{className:"legend",children:[(0,s.jsx)("div",{className:"".concat(o().className," text-center mb-2 font-medium"),children:"Legend"}),(null==R?void 0:R.legend)?Object.keys(R.legend).map(e=>(0,s.jsxs)("div",{className:"legend-item flex items-center mb-1",children:[(0,s.jsx)("span",{className:"legend-color block w-4 h-4 mr-2",style:{backgroundColor:R.legend[e]}}),(0,s.jsx)("span",{className:"legend-label",children:e})]},e)):(0,s.jsx)("div",{className:"text-center text-gray-500",children:"No legend available."})]})})]})]})}),(0,s.jsx)(r,{className:"mb-4",children:(0,s.jsxs)("section",{id:"trends",children:[(0,s.jsx)("div",{className:"".concat(o().className," text-accent-dark text-2xl pb-2"),children:"Trends"}),(0,s.jsx)(p,{})]})}),(0,s.jsx)(r,{children:(0,s.jsxs)("section",{id:"agriculture-insights",children:[(0,s.jsx)("div",{className:"".concat(o().className," text-accent-dark text-2xl pb-2"),children:"Agriculture Insights"}),(0,s.jsxs)("div",{className:"flex items-center justify-center mb-2",children:[(0,s.jsx)("div",{className:"".concat(c().className," mr-2 mb-0"),children:"Estimated Land Suitability of:"}),(0,s.jsx)(f,{options:D,selected:U,onSelect:T})]}),(0,s.jsxs)("div",{className:"flex mb-4",children:[(0,s.jsx)("div",{className:"w-full",children:(null==R?void 0:R.bbox)&&(null==R?void 0:R.imageUrl)?(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(O,{latitude:u,longitude:b,zoom:15,bbox:R.bbox,imageUrl:Y[U]})}):(0,s.jsx)("div",{className:"text-center text-gray-500",children:"No map data available."})}),(0,s.jsx)("div",{className:"w-32 pl-4",children:(0,s.jsxs)("div",{className:"flex-row justify-center items-center text-center font-medium",children:[(0,s.jsx)("p",{className:"".concat(o().className),children:"Yield"}),(0,s.jsx)("p",{className:"mb-2",children:"(Bushels/Acre)"}),(0,s.jsx)(e=>{let{vmin:a,vmax:t,numIntervals:r=5}=e,n=(0,l.useRef)(null);(0,l.useEffect)(()=>{let e=n.current;if(!e){console.error("Canvas element not found");return}let s=e.getContext("2d");if(!s)throw Error("Failed to get canvas 2D context");let l=y().scale(M).domain([t,a]);for(let r=0;r<e.height;r++){let n=l(a+r/e.height*(t-a)).hex();s.fillStyle=n,s.fillRect(0,r,e.width,1)}},[a,t]);let c=((e,a,t)=>{let s=(a-e)/(t-1),l=[];for(let a=0;a<t;a++)l.push(e+a*s);return l})(a,t,r);return(0,s.jsxs)("div",{className:"flex justify-center",children:[(0,s.jsx)("canvas",{ref:n,width:30,height:300}),(0,s.jsx)("div",{className:"flex flex-col justify-between ml-2",children:c.reverse().map((e,a)=>(0,s.jsx)("span",{children:e.toFixed(1)},a))})]})},{vmin:z.vmin,vmax:z.vmax})]})})]}),(0,s.jsxs)("div",{className:"ml-4",children:[(0,s.jsx)("div",{className:"".concat(m().className," font-lg mb-2"),children:"Common crop rotations for ".concat(U,":")}),(0,s.jsx)("ul",{className:"ml-4",children:null===(e=({Flaxseed:[["Flaxseed","Flaxseed"],["Flaxseed","Grass"],["Flaxseed","Barley","Grass"]],Wheat:[["Wheat","Fallow"],["Wheat","Legume"],["Wheat","Canola","Barley"],["Wheat","Soybeans","Corn"]],Barley:[["Barley","Fallow"],["Barley","Peas"]],Oats:[["Oats","Soybeans","Corn"],["Oats","Canola","Wheat"],["Oats","Flaxseed","Oats"]],Canola:[["Canola","Fallow"],["Canola","Legume"],["Canola","Wheat","Barley"]],Peas:[["Peas","Oats","Corn"],["Peas","Flaxseed","Peas"]],Corn:[["Corn","Fallow"],["Corn","Soybeans"],["Corn","Wheat","Clover"]],Soy:[["Soy","Fallow"],["Soy","Corn"],["Soy","Wheat","Canola"]]})[U])||void 0===e?void 0:e.map((e,a)=>(0,s.jsx)("li",{className:"mb-1",children:Array.isArray(e)?e.map((a,t)=>(0,s.jsxs)("span",{children:[a,t<e.length-1&&(0,s.jsx)(F.Z,{className:"inline-block mx-1"})]},t)):(0,s.jsx)("span",{children:e})},a))})]})]})})]})]})})}},223:function(e,a,t){"use strict";t.d(a,{Z:function(){return c}});var s=t(7437),l=t(2265),r=t(7744);let n=["places"];function c(e){let{onAddressSelect:a,prompt:t}=e,c=(0,l.useRef)(null),{isLoaded:i,loadError:o}=(0,r.Db)({googleMapsApiKey:"AIzaSyDR116R2PRPMu81WsGWkLR6j5sMoB8PT_0",libraries:n});(0,l.useEffect)(()=>{if(!i||o||!c.current)return;let e=new google.maps.places.Autocomplete(c.current,{componentRestrictions:{country:"ca"},fields:["formatted_address","geometry"]}),a=e.addListener("place_changed",()=>{d(e)});return()=>{google.maps.event.removeListener(a),e.unbindAll()}},[i,o]);let d=e=>{var t;let s=e.getPlace();if((null==s?void 0:s.formatted_address)&&(null==s?void 0:null===(t=s.geometry)||void 0===t?void 0:t.location)){let e=s.geometry.location.lat(),t=s.geometry.location.lng();a(s.formatted_address,e,t)}else console.error("No place details available")};return(0,s.jsx)("div",{className:"relative w-full max-w-lg",children:(0,s.jsx)("input",{type:"text",ref:c,placeholder:t,className:"w-full text-black px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500"})})}}},function(e){e.O(0,[639,910,40,861,971,23,744],function(){return e(e.s=4474)}),_N_E=e.O()}]);