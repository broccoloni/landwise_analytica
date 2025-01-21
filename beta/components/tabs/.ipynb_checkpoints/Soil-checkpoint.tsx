'use client';

import React, { useState, useEffect } from 'react';
import { montserrat, roboto, merriweather } from '@/ui/fonts';
import dynamic from 'next/dynamic';
import Loading from '@/components/Loading';
import Dropdown from '@/components/Dropdown';
import Legend from '@/components/Legend';
import ColorBar from '@/components/ColorBar';
import { Slider } from "@mui/material";
import PlainTable from '@/components/PlainTable';
import WindDirectionDisplay from "@/components/WindDirectionDisplay";
import { rangeColors } from '@/types/colorPalettes';
import { ImageAndLegend, ImageAndStats, PerformanceData} from '@/types/dataTypes';

const MapImage = dynamic(() => import('@/components/MapImage'), { ssr: false });

const Soil = (
  { lat, lng, soilData, bbox, score, setScore }: 
  { lat: string|number|null; lng: string|number|null; 
    soilData: any;
    bbox: number[][]|null; score: number | null; setScore: React.Dispatch<React.SetStateAction<number | null>>; }) => {

  // For classification
  const [classificationView, setClassificationView] = useState<string>('Taxonomy');
  const [classificationDepth, setClassificationDepth] = useState<string>('Surface');
  const [curClassificationData, setCurClassificationData] = useState<ImageAndLegend|null>(null);

  // For Contents
  const [contentView, setContentView] = useState<string>('Water (Field Capacity / 33kPa)');
  const [contentDepth, setContentDepth] = useState<string>('Surface');
  const [curContentData, setCurContentData] = useState<ImageAndStats|null>(null);

  // For Attributes
  const [attributeView, setAttributeView] = useState<string>('Water pH');
  const [attributeDepth, setAttributeDepth] = useState<string>('Surface');
  const [curAttributeData, setCurAttributeData] = useState<ImageAndStats|null>(null);
      
  useEffect(() => {
    if (classificationView && classificationDepth && soilData) {
      if (classificationView === 'Taxonomy') {
        setCurClassificationData(soilData.taxonomy as ImageAndLegend);
      } 
      else {
        const bands = soilData.texture as Record<string, ImageAndLegend>;
        const depthMap: { [key: string]: string } = {
          'Surface': 'b0',
          '10cm': 'b10',
          '30cm': 'b30',
        };

        const bandKey = depthMap[classificationDepth];
        if (bandKey && bands[bandKey]) {
          setCurClassificationData(bands[bandKey]);
        } else {
          setCurClassificationData(null);
        }
      } 
    }
  }, [classificationView, classificationDepth, soilData]);


  useEffect(() => {
    if (contentView && contentDepth && soilData) {
      let bands = null;
      switch (contentView) {
        case 'Water (Field Capacity / 33kPa)':
          bands = soilData.water;
          break;
        case 'Sand':
          bands = soilData.sand;
          break;
        case 'Clay':
          bands = soilData.clay;
          break;
        case 'Organic Carbon':
          bands = soilData.carbon;
          break;
        default:
          break;
      }

      let depth = null;
      switch (contentDepth) {
        case 'Surface':
          depth = 'b0';
          break;
        case '10cm':
          depth = 'b10';
          break;
        case '30cm':
          depth = 'b30';
          break;
        default:
          break;
      }

      if (bands && depth) {
        setCurContentData(bands[depth] as ImageAndStats);
      }
    }
  }, [contentView, contentDepth, soilData]);

  useEffect(() => {
    if (attributeView && attributeDepth && soilData) {
      let bands = null;
      switch (attributeView) {
        case 'Water pH':
          bands = soilData.ph;
          break;
        case 'Bulk Density':
          bands = soilData.density;
          break;
        default:
          break;
      }

      let depth = null;
      switch (attributeDepth) {
        case 'Surface':
          depth = 'b0';
          break;
        case '10cm':
          depth = 'b10';
          break;
        case '30cm':
          depth = 'b30';
          break;
        default:
          break;
      }

      if (bands && depth) {
        setCurAttributeData(bands[depth] as ImageAndStats);
      }
    }
  }, [attributeView, attributeDepth, soilData]);
      
  return (
    <div>
      <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
        Soil
      </div>

      {/* Soil Classifications */}
      <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg`}>Soil Classifications</div>
        {curClassificationData ? (
          <div className="flex w-full">
            <div className="w-[40%] mt-8 p-4">
              <div className={`${montserrat.className} mb-4 mx-4`}>Summary</div>
              <PlainTable             
                headers={['Variable', 'Classifications Found']}
                data={[
                  { 
                    v:'Taxonomy', 
                    c: Object.keys(soilData.taxonomy.legend).join(', '),
                  },
                  { 
                    v:'Texture at Surface', 
                    c: Object.keys(soilData.texture['b0'].legend).join(', '),
                  },
                  { 
                    v:'Texture at 10cm', 
                    c: Object.keys(soilData.texture['b10'].legend).join(', '),
                  },
                  { 
                    v:'Texture at 30cm', 
                    c: Object.keys(soilData.texture['b30'].legend).join(', '),
                  },
                ]}
              />
            </div>
            <div className="w-[60%] flex-row">
              <div className="flex w-full">
                <div className="w-full">
                  <div className="flex justify-center items-center h-16">
                    <div className={`${montserrat.className} mr-4`}>Classification Type:</div>                    
                    <Dropdown 
                      options={['Taxonomy','Texture']} 
                      selected={classificationView} 
                      onSelect={(selected) => setClassificationView(selected)} 
                    />
                    {classificationView === 'Texture' && (
                      <> 
                        <div className={`${montserrat.className} mx-4`}> at </div>
                        <Dropdown 
                          options={['Surface','10cm','30cm']} 
                          selected={classificationDepth} 
                          onSelect={(selected) => setClassificationDepth(selected)} 
                        />  
                      </>
                    )}
                  </div>
                  {lat && lng && bbox && curClassificationData.imageUrl && (
                    <MapImage latitude={lat} longitude={lng} zoom={15} bbox={bbox} imageUrl={curClassificationData.imageUrl} />
                  )}
                </div>
                <div className="flex-row ml-2 justify-start items-center mt-16">
                  <Legend legend={curClassificationData.legend} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </div>

      {/* Soil Content */}
      <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg`}>Soil Content</div>
        {curContentData ? (
          <div className="flex w-full">
            <div className="w-[40%] mt-8 p-4">
              <div className={`${montserrat.className} mb-4 mx-4`}>Summary</div>
              <PlainTable             
                headers={['Variable', 'Average at Surface','Average at 10cm','Average at 30cm']}
                data={[
                  { 
                    v:'Water Content at 33kPa, Field Capacity (%)', 
                    a1: `${soilData.water['b0'].avg.toFixed(2)} \u00B1 ${soilData.water['b0'].std.toFixed(2)}`,
                    a2:`${soilData.water['b10'].avg.toFixed(2)} \u00B1 ${soilData.water['b10'].std.toFixed(2)}`,
                    a3:`${soilData.water['b30'].avg.toFixed(2)} \u00B1 ${soilData.water['b30'].std.toFixed(2)}`,
                  },
                  { 
                    v:'Sand Content (% kg/kg)', 
                    a1: `${soilData.sand['b0'].avg.toFixed(2)} \u00B1 ${soilData.sand['b0'].std.toFixed(2)}`,
                    a2:`${soilData.sand['b10'].avg.toFixed(2)} \u00B1 ${soilData.sand['b10'].std.toFixed(2)}`,
                    a3:`${soilData.sand['b30'].avg.toFixed(2)} \u00B1 ${soilData.sand['b30'].std.toFixed(2)}`,
                  },
                  { 
                    v:'Clay Content (% kg/kg)', 
                    a1: `${soilData.clay['b0'].avg.toFixed(2)} \u00B1 ${soilData.clay['b0'].std.toFixed(2)}`,
                    a2:`${soilData.clay['b10'].avg.toFixed(2)} \u00B1 ${soilData.clay['b10'].std.toFixed(2)}`,
                    a3:`${soilData.clay['b30'].avg.toFixed(2)} \u00B1 ${soilData.clay['b30'].std.toFixed(2)}`,
                  },
                  { 
                    v:'Organic Carbon Content (5g/kg)', 
                    a1: `${soilData.carbon['b0'].avg.toFixed(2)} \u00B1 ${soilData.carbon['b0'].std.toFixed(2)}`,
                    a2:`${soilData.carbon['b10'].avg.toFixed(2)} \u00B1 ${soilData.carbon['b10'].std.toFixed(2)}`,
                    a3:`${soilData.carbon['b30'].avg.toFixed(2)} \u00B1 ${soilData.carbon['b30'].std.toFixed(2)}`,
                  }
                ]}
              />
            </div>
            <div className="w-[60%] flex-row">
              <div className="flex w-full">
                <div className="w-full">
                  <div className="flex justify-center items-center h-16">
                    <div className={`${montserrat.className} mr-4`}>Content Type:</div>                    
                    <Dropdown 
                      options={['Water (Field Capacity / 33kPa)','Sand', 'Clay', 'Organic Carbon']} 
                      selected={contentView} 
                      onSelect={(selected) => setContentView(selected)} 
                    />
                    <div className={`${montserrat.className} mx-4`}> at </div>
                    <Dropdown 
                      options={['Surface','10cm','30cm']} 
                      selected={contentDepth} 
                      onSelect={(selected) => setContentDepth(selected)} 
                    />  
                  </div>
                  {lat && lng && bbox && curContentData.imageUrl && (
                    <MapImage latitude={lat} longitude={lng} zoom={15} bbox={bbox} imageUrl={curContentData.imageUrl} />
                  )}
                </div>
                <div className="flex-row ml-2 justify-start items-center mt-16">
                  <div className={`${merriweather.className} mb-2 text-center flex-row justify-center items-center text-center`}>
                    <div>Soil Content</div>
                    <div>
                      {contentView === 'Water (Field Capacity / 33kPa)' ? (
                        "(%)"
                      ) : contentView === 'Organic Carbon' ? (
                        "(5g/kg)"
                      ) : (
                        "%  (kg/kg)"
                      )}
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <ColorBar
                      vmin={curContentData.min}
                      vmax={curContentData.max}
                      numIntervals={5}
                      heatmapColors={rangeColors}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </div>

      {/* Soil Attributes */}
      <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg`}>Soil Attributes</div>
        {curAttributeData ? (
          <div className="flex w-full">
            <div className="w-[40%] mt-8 p-4">
              <div className={`${montserrat.className} mb-4 mx-4`}>Summary</div>
              <PlainTable             
                headers={['Variable', 'Average at Surface','Average at 10cm','Average at 30cm']}
                data={[
                  { 
                    v:'Soil Water pH (\u00D710)', 
                    a1: `${soilData.ph['b0'].avg.toFixed(2)} \u00B1 ${soilData.ph['b0'].std.toFixed(2)}`,
                    a2:`${soilData.ph['b10'].avg.toFixed(2)} \u00B1 ${soilData.ph['b10'].std.toFixed(2)}`,
                    a3:`${soilData.ph['b30'].avg.toFixed(2)} \u00B1 ${soilData.ph['b30'].std.toFixed(2)}`,
                  },
                  { 
                    v:'Bulk Density (10 kg / m\u00B3)', 
                    a1: `${soilData.density['b0'].avg.toFixed(2)} \u00B1 ${soilData.density['b0'].std.toFixed(2)}`,
                    a2:`${soilData.density['b10'].avg.toFixed(2)} \u00B1 ${soilData.density['b10'].std.toFixed(2)}`,
                    a3:`${soilData.density['b30'].avg.toFixed(2)} \u00B1 ${soilData.density['b30'].std.toFixed(2)}`,
                  },
                ]}
              />
            </div>
            <div className="w-[60%] flex-row">
              <div className="flex w-full">
                <div className="w-full">
                  <div className="flex justify-center items-center h-16">
                    <div className={`${montserrat.className} mr-4`}>Attribute Type:</div>                    
                    <Dropdown 
                      options={['Water pH','Bulk Density']} 
                      selected={attributeView} 
                      onSelect={(selected) => setAttributeView(selected)} 
                    />
                    <div className={`${montserrat.className} mx-4`}> at </div>
                    <Dropdown 
                      options={['Surface','10cm','30cm']} 
                      selected={attributeDepth} 
                      onSelect={(selected) => setAttributeDepth(selected)} 
                    />  
                  </div>
                  {lat && lng && bbox && curAttributeData.imageUrl && (
                    <MapImage latitude={lat} longitude={lng} zoom={15} bbox={bbox} imageUrl={curAttributeData.imageUrl} />
                  )}
                </div>
                <div className="flex-row ml-2 justify-start items-center mt-16">
                  <div className={`${merriweather.className} mb-2 text-center flex-row justify-center items-center text-center`}>
                    <div>
                      {attributeView === 'Water pH' ? (
                        "pH (\u00D710)"
                      ) : (
                        '10 kg / m\u00B3'
                      )}
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <ColorBar
                      vmin={curAttributeData.min}
                      vmax={curAttributeData.max}
                      numIntervals={5}
                      heatmapColors={rangeColors}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};

export default Soil;