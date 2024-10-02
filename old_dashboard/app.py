import streamlit as st
import folium
import rasterio
import numpy as np
from folium.raster_layers import ImageOverlay
from streamlit_folium import folium_static
from matplotlib import pyplot as plt
from matplotlib.colors import ListedColormap
import branca
import branca.colormap as cm
from branca.colormap import LinearColormap
import matplotlib.colors
import os
import plotly.express as px
import pandas as pd
import seaborn as sns
import imageio


st.set_page_config(layout="centered")


st.image(os.getcwd()+"/logo.PNG")
# Create the top navigation bar with tabs
tab0, tab1, tab2, tab3 = st.tabs(["Property", "Land History", "Trends", "Agriculture Tips"])

with tab0:
    st.title('Property')
    st.write('This is a mock report for 8159 30 Sideroad, Centre Wellington, ON, N0B 2K0')
    st.image(os.getcwd()+"/farm.PNG")


# Add content to each tab
with tab1:
    
    col1, col2 = st.columns([3, 1])  # Adjust the column width ratio as needed
    with col1:
        st.title("Land History")
    with col2:
        year = st.slider('Select Year for Land History', min_value=2014, max_value=2021, step=1)


    st.subheader('Prior Inventory')
    
    raster_file = 'farm_data/land_history/prior_inventory/'+str(year)+'.tif'
    
    # Read the raster file and extract the data and metadata
    with rasterio.open(raster_file) as src:
        bounds = src.bounds
        data = src.read(1)  # Read the first band
        
        total_elements = data.size
        unique_elements, counts = np.unique(data, return_counts=True)
        one_percent_threshold = total_elements * 0.011
        rare_elements = unique_elements[counts < one_percent_threshold]
        for element in rare_elements:
            data[data == element] = 0
        
    # Define a custom colormap 0  34  50  80 110 122 145 147 158 220 230
    value_to_color = {
                    0: 'black',
                    10: '#000000',
                    20: '#3333ff',
                    30: '#996666',
                    34: '#cc6699',
                    35: '#e1e1e1',
                    50: '#ffff00',
                    80: '#993399',
                    85: '#501b50',
                    110: '#cccc00',
                    120: '#cc6600',
                    122: '#ffcc33',
                    130: '#7899f6',
                    131: '#ff9900',
                    132: '#660000',
                    133: '#dae31d',
                    134: '#d6cc00',
                    135: '#d2db25',
                    136: '#d1d52b',
                    137: '#cace32',
                    138: '#c3c63a',
                    139: '#b9bc44',
                    140: '#a7b34d',
                    141: '#b9c64e',
                    142: '#999900',
                    143: '#e9e2b1',
                    145: '#92a55b',
                    146: '#809769',
                    147: '#ffff99',
                    148: '#98887c',
                    149: '#799b93',
                    150: '#5ea263',
                    151: '#52ae77',
                    152: '#41bf7a',
                    153: '#d6ff70',
                    154: '#8c8cff',
                    155: '#d6cc00',
                    156: '#ff7f00',
                    157: '#315491',
                    158: '#cc9933',
                    160: '#896e43',
                    161: '#996633',
                    162: '#8f6c3d',
                    163: '#b6a472',
                    167: '#82654a',
                    168: '#a39069',
                    174: '#b85900',
                    175: '#b74b15',
                    176: '#ff8a8a',
                    177: '#ffcccc',
                    178: '#6f55ca',
                    179: '#ffccff',
                    180: '#dc5424',
                    181: '#d05a30',
                    182: '#d20000',
                    183: '#cc0000',
                    185: '#dc3200',
                    188: '#ff6666',
                    189: '#c5453b',
                    190: '#7442bd',
                    191: '#ffcccc',
                    192: '#b5fb05',
                    193: '#ccff05',
                    194: '#07f98c',
                    195: '#00ffcc',
                    196: '#cc33cc',
                    197: '#8e7672',
                    198: '#b1954f',
                    199: '#749a66',
                    200: '#009900',
                    210: '#006600',
                    220: '#00cc00',
                    230: '#cc9900'
                }
    
    name_to_color = {
                    'Cloud': '#000000',
                    'Water': '#3333ff',
                    'Barren': '#996666',
                    'Developed': '#cc6699',
                    'Greenhouses': '#e1e1e1',
                    'Shrubland': '#ffff00',
                    'Wetland': '#993399',
                    'Peatland': '#501b50',
                    'Grassland': '#cccc00',
                    'Agriculture': '#cc6600',
                    'Flaxseed': '#ffcc33',
                    'Too Wet': '#7899f6',
                    'Fallow': '#ff9900',
                    'Cereals': '#660000',
                    'Barley': '#dae31d',
                    'Other Grains': '#d6cc00',
                    'Millet': '#d2db25',
                    'Oats': '#d1d52b',
                    'Rye': '#cace32',
                    'Spelt': '#c3c63a',
                    'Triticale': '#b9bc44',
                    'Wheat': '#a7b34d',
                    'Switchgrass': '#b9c64e',
                    'Sorghum': '#999900',
                    'Quinoa': '#e9e2b1',
                    'Winter Wheat': '#92a55b',
                    'Spring Wheat': '#809769',
                    'Corn': '#ffff99',
                    'Tobacco': '#98887c',
                    'Ginseng': '#799b93',
                    'Oilseeds': '#5ea263',
                    'Borage': '#52ae77',
                    'Camelina': '#41bf7a',
                    'Canola': '#d6ff70',
                    'Flaxseed2': '#8c8cff',
                    'Mustard': '#d6cc00',
                    'Safflower': '#ff7f00',
                    'Sunflower': '#315491',
                    'Soybeans': '#cc9933',
                    'Pulses': '#896e43',
                    'Other Pulses': '#996633',
                    'Peas': '#8f6c3d',
                    'Chickpeas': '#b6a472',
                    'Beans': '#82654a',
                    'Fababeans': '#a39069',
                    'Lentils': '#b85900',
                    'Vegetables': '#b74b15',
                    'Tomatoes': '#ff8a8a',
                    'Potatoes': '#ffcccc',
                    'Sugarbeets': '#6f55ca',
                    'Other Veg': '#ffccff',
                    'Fruits': '#dc5424',
                    'Berries': '#d05a30',
                    'Blueberry': '#d20000',
                    'Cranberry': '#cc0000',
                    'Other Berry': '#dc3200',
                    'Orchards': '#ff6666',
                    'Other Fruits': '#c5453b',
                    'Vineyards': '#7442bd',
                    'Hops': '#ffcccc',
                    'Sod': '#b5fb05',
                    'Herbs': '#ccff05',
                    'Nursery': '#07f98c',
                    'Buckwheat': '#00ffcc',
                    'Canaryseed': '#cc33cc',
                    'Hemp': '#8e7672',
                    'Vetch': '#b1954f',
                    'Other Crops': '#749a66',
                    'Forest': '#009900',
                    'Coniferous': '#006600',
                    'Broadleaf': '#00cc00',
                    'Mixedwood': '#cc9900'
                }

    
    # Reverse the name_to_color to color_to_name for easy lookup
    color_to_name = {color: name for name, color in name_to_color.items()}

    # New dictionary to hold the results
    selected_names_colors = {}

    # Iterate over the data values to find corresponding colors and then names
    for value in np.unique(data):
        color = value_to_color.get(value)
        if color:
            name = color_to_name.get(color)
            if name:
                selected_names_colors[name] = color

    print(selected_names_colors)
    

    colormap_values = sorted(value_to_color.keys())
    colors = [value_to_color[value] for value in colormap_values]
    custom_colormap = ListedColormap(colors)


    # Map the data values to colormap indices
    index_map = {v: i for i, v in enumerate(colormap_values)}
    mapped_indices = np.vectorize(index_map.get)(data)

    # Apply the colormap
    color_mapped_data = custom_colormap(mapped_indices)[:, :, :3]

    # Create an alpha channel, setting zero values (or near zero) to transparent
    alpha = np.where(data > 0, 1, 0).astype(float)  # Change 0 to your specific threshold if needed

    # Combine the color mapped data with the alpha channel
    image_data = np.dstack((color_mapped_data, alpha))

    # Create a folium map centered on the raster
    m = folium.Map(location=[(bounds.top + bounds.bottom) / 2, (bounds.left + bounds.right) / 2], zoom_start=15)

    # Define the bounds of the image on the map
    image_bounds = [[bounds.bottom, bounds.left], [bounds.top, bounds.right]]

    # Add the color-mapped raster as an overlay on the map
    ImageOverlay(
        image=image_data,
        bounds=image_bounds,
        origin='upper',
        zindex=1,
    ).add_to(m)
    
    
 
    # Use columns to layout the map and legend
    col1, col2 = st.columns([4, 1])  # Adjust the ratio to your preference

    with col1:
        folium_static(m)

    with col2:
        st.subheader("Legend")
        for value, color in selected_names_colors.items():
            st.markdown(f"<div style='display: flex; align-items: center;'><div style='width: 20px; height: 20px; background-color: {color};'></div><span style='margin-left: 10px;'>{value}</span></div>", unsafe_allow_html=True)
            
            
            
            
            
    crops_iy = ["Flaxseed", "Wheat", "Barley", "Oats", "Canola", "Peas", "Corn", "Soy"]

    col1, col2 = st.columns(2)
    with col1:
        st.subheader('Inventory Yield')
    with col2:
        selected_crop_iy = st.selectbox("Select a crop", crops_iy)
        
        
    raster_file2 = 'farm_data/land_history/inventory_yields/'+str(year)+'_'+selected_crop_iy+'.tif'
    
    
    # Read the raster file and extract the data and metadata
    try:
        with rasterio.open(raster_file2) as src:
            bounds2 = src.bounds
            data2 = src.read(1)  # Read the first band
            # Clip the data to the range of 60 to 100
            data_clipped = np.clip(data2, 60, 100)

            # Normalize the clipped data to the 0-255 range for display
            # Assuming you want to stretch the values between 60 and 100 across the full colormap range
            norm_data = (data_clipped - 60) / (100 - 60)  # This normalizes the data to 0-1
            color_mapped_data = plt.cm.plasma(norm_data)  # Apply the 'viridis' colormap

        # Create a folium map centered on the raster
        m2 = folium.Map(location=[(bounds2.top + bounds2.bottom) / 2, (bounds2.left + bounds2.right) / 2], zoom_start=15)

        # Define the bounds of the image on the map
        image_bounds2 = [[bounds2.bottom, bounds2.left], [bounds2.top, bounds2.right]]

        # Create a colormap object
        num_colors = 256
        plasma_cm = plt.cm.get_cmap('plasma', num_colors)
        plasma_colors = [plasma_cm(i) for i in range(plasma_cm.N)]

        # Convert RGBA colors to hexadecimal
        plasma_hex = [matplotlib.colors.rgb2hex(color) for color in plasma_colors]

        # Create a LinearColormap in branca using the hexadecimal plasma colors
        plasma_linear = LinearColormap(plasma_hex, vmin=60, vmax=100)
        plasma_linear.caption = 'Yield (Bushels/Acre)'
        plasma_linear.add_to(m2)

        # Add the color-mapped raster as an overlay on the map
        ImageOverlay(
            image=color_mapped_data,
            bounds=image_bounds2,
            origin='upper',
            zindex=1,
        ).add_to(m2)


        mean_yield = np.nanmean(data2) + year - 2020
        mean_yield_formatted = "{:.0f}".format(mean_yield)
        st.write("For the " + str(year) + " growing season, the average yield for " + selected_crop_iy + " was " + mean_yield_formatted + " Bushels/Acre.")
        folium_static(m2)
        
        
        
    except:
        m2 = folium.Map(location=[(bounds.top + bounds.bottom) / 2, (bounds.left + bounds.right) / 2], zoom_start=15)
        st.write("<span style='color:red;'>The selected crop was not cultivated on this property during the " + str(year) + " growing season.</span>", unsafe_allow_html=True)
        folium_static(m2)
        


        




with tab2:
        
    crops_t = ["Flaxseed", "Wheat", "Barley", "Oats", "Canola", "Peas", "Corn", "Soy"]

    col1, col2 = st.columns(2)
    with col1:
        st.title('Trends')
    with col2:
        selected_crop_t = st.selectbox("Select a crop to generate trends", crops_t)
        
    st.subheader('Estimated Historic & Projected Land Suitability: '+selected_crop_t)
        
    df = pd.read_csv('farm_data/trends/crop_yield_per_year.csv')
    
    df = df[(df['Year'] >= 2014) & (df['Year'] <= 2034)]
    df = df[df['Crop'] == selected_crop_t]

    
    # Filter the DataFrame to include only the rows for the levels you want to plot
    # This step is optional if you want to plot all levels
    df_filtered = df[df['levels'].isin(['Property', 'Neighbourhood', 'National'])]

    # Create an interactive line chart using Plotly
    # Here, 'Year' is assumed to be your x-axis and 'Yield' your y-axis
    fig = px.line(df_filtered, x='Year', y='Yield', color='levels', labels={
        "Yield": "Yield",
        "Year": "Year",
        "Level": "Level"
    })

    # Add chart title and enhance the legend
    fig.add_vline(x=2024, line_dash="dash", line_color="grey", annotation_text="2024")
    fig.update_layout(legend_title='Level')
    fig.update_xaxes(title='Year')
    fig.update_yaxes(title='Estimated Land Suitability (Bushels/Acre)')

    # Display the chart in Streamlit
    st.plotly_chart(fig)
    
    
    st.subheader('Estimated Land Suitability Summary Table')
    st.write('This table summarizes the present and projected ten-year suitability of various crops for the specified property. It helps determine the optimal crops for cultivation on the farm and assesses their long-term viability.')
    
    summary_df = pd.read_csv('farm_data/trends/summary_table.csv')

    summary_df.insert(1, ' ', '')

    # Insert another blank column for spacing after the 4th column (now 5th due to the first insertion, 0-based index)
    summary_df.insert(5, '  ', '')

    def apply_highlight_color(row):
        # Define colors in proper CSS format
        light_green = 'background-color: rgb(204, 255, 204);'
        light_red = 'background-color: rgb(255, 230, 230);'

        # Setup highlighting conditions for column 2 and 6
        green_conditions_col2 = {0, 1, 5, 6}  # Zero-based indices for rows
        green_conditions_col6 = {0, 1, 2, 5}  # Zero-based indices for rows

        # Initialize an array with default (empty) styles for each cell
        styles = [''] * len(row)

        # Apply colors based on conditions
        # Adjust column indices for the added blank columns
        if row.name in green_conditions_col2:
            styles[2] = light_green  # Adjusted Column 2 index to 2 (after inserting a blank column)
        else:
            styles[2] = light_red  # Adjusted Column 2 index to 2

        if row.name in green_conditions_col6:
            styles[6] = light_green  # Adjusted Column 6 index to 6 (after inserting two blank columns)
        else:
            styles[6] = light_red  # Adjusted Column 6 index to 6

        return styles

    # Apply the color style function selectively on adjusted columns 2 and 6
    styled_df = summary_df.style.apply(apply_highlight_color, axis=1)

    # Hide the index
    styled_df = styled_df.hide_index()

    # Assuming you are using Streamlit to display the dataframe
    st.write(styled_df.to_html(), unsafe_allow_html=True)
    
    st.write("The units are bushels/acre.")


        
        
        

with tab3:
    
    crops_iy = ["Flaxseed", "Wheat", "Barley", "Oats", "Canola", "Peas", "Corn", "Soy"]

    col1, col2 = st.columns(2)
    with col1:
        st.title('Agriculture Tips')
    with col2:
        selected_crop_iy = st.selectbox("Select a crop for Tips", crops_iy)
        
    st.subheader('Land-Use Planning')
    st.write('The land suitability maps serve as a guide for land-use planning.')
        
        
    raster_file3 = 'farm_data/ag_tips/'+selected_crop_iy+'.png'
    raster_file3 = imageio.imread(raster_file3, pilmode='L')
    
    print(raster_file3.shape, 'rastor3')


    norm_data = (raster_file3 - np.min(raster_file3)) / (np.max(raster_file3) - np.min(raster_file3))  # This normalizes the data to 0-1
    # Apply the 'plasma' colormap to normalized data
    color_mapped_data = plt.cm.plasma(norm_data)

    # Create an alpha channel, setting zero values (or near zero) to transparent
    alpha = np.where(raster_file3 > 0, 1, 0).astype(float)  # Change 0 to your specific threshold if needed

    # Combine the color-mapped data with the alpha channel
    image_data = np.dstack((color_mapped_data[:, :, :3], alpha))

    # Create a folium map centered on the raster
    m4 = folium.Map(location=[(bounds.top + bounds.bottom) / 2, (bounds.left + bounds.right) / 2], zoom_start=15)

    # Create a colormap object for 'plasma'
    num_colors = 256
    plasma_cm = plt.cm.get_cmap('plasma', num_colors)
    plasma_colors = [plasma_cm(i) for i in range(plasma_cm.N)]

    # Convert RGBA colors to hexadecimal
    plasma_hex = [matplotlib.colors.rgb2hex(color) for color in plasma_colors]

    # Determine vmin and vmax based on selected crop
    if selected_crop_iy == "Flaxseed":
        vmin = 76-20
        vmax = 76+20
    if selected_crop_iy == "Wheat":
        vmin = 97-20
        vmax = 97+20
    if selected_crop_iy == "Barley":
        vmin = 81-20
        vmax = 81+20
    if selected_crop_iy == "Oats":
        vmin = 76-20
        vmax = 76+20
    if selected_crop_iy == "Canola":
        vmin = 63-20
        vmax = 63+20
    if selected_crop_iy == "Peas":
        vmin = 86-20
        vmax = 86+20
    if selected_crop_iy == "Corn":
        vmin = 83-20
        vmax = 83+20
    if selected_crop_iy == "Soy":
        vmin = 83-20
        vmax = 83+20

    # Create a LinearColormap in branca using the hexadecimal plasma colors
    plasma_linear = LinearColormap(plasma_hex, vmin=vmin, vmax=vmax)
    plasma_linear.caption = 'Yield (Bushels/Acre)'
    plasma_linear.add_to(m4)

    # Add the color-mapped raster as an overlay on the map
    ImageOverlay(
        image=image_data,
        bounds=image_bounds,
        origin='upper',
        zindex=1,
    ).add_to(m4)



    folium_static(m4)
    
    
    st.subheader('Common Crop Rotations')
    st.write('Here are some common crop rotation patterns for '+selected_crop_iy+' in your county and across the country.')
    
    
#     county_rots = [['Flaxseed', 50.0, 1.17, 2.85, 3.6, 3.79, 8.21, 19.91, 0.65, 9.82],
#                     ['Wheat', 14.94, 5.3, 3.01, 14.47, 1.11, 21.2, 13.23, 9.5, 17.24],
#                     ['Barley', 9.08, 20.08, 6.95, 13.81, 13.03, 11.03, 10.4, 7.7, 7.92],
#                     ['Oats', 1.64, 3.58, 11.51, 19.29, 8.81, 15.99, 18.83, 18.77, 1.58],
#                     ['Canola', 8.1, 11.75, 11.89, 1.82, 14.87, 13.94, 13.14, 9.49, 15.0],
#                     ['Peas', 17.37, 13.21, 10.4, 8.8, 4.8, 10.94, 18.1, 2.13, 14.25],
#                     ['Corn', 8.66, 19.86, 6.22, 8.68, 13.46, 9.76, 17.14, 10.88, 5.34],
#                     ['Soy', 14.6, 2.24, 9.55, 25.94, 1.62, 10.38, 16.41, 3.88, 15.38]]
#     county_rots = pd.DataFrame(county_rots, columns=["", "Flaxseed", "Wheat", "Barley", "Oats", "Canola", "Peas", "Corn", "Soy", "Other"])
#     numeric_columns = county_rots.select_dtypes(include=[np.number]).columns
#     county_rots[numeric_columns] = county_rots[numeric_columns].applymap(lambda x: f'{x:.2f}%')
#     st.write(county_rots.to_html(index=False), unsafe_allow_html=True)


    county_rots = {'Flaxseed': [('Flaxseed', 'Flaxseed'), ('Flaxseed', 'Grass'), ('Flaxseed', 'Barley', 'Grass')], 
                   'Wheat': [('Wheat', 'Fallow'), ('Wheat', 'Legume'), ('Wheat', 'Canola', 'Barley'), ('Wheat', 'Soybeans', 'Corn')],
                   'Barley': [('Barley', 'Fallow'), ('Barley', 'Peas')], 
                   'Oats': [('Oats', 'Soybeans', 'Corn'), ('Oats', 'Canola', 'Wheat'), ('Oats', 'Flaxseed', 'Oats')], 
                   'Canola': [('Canola', 'Fallow'), ('Canola', 'Legume'), ('Canola', 'Wheat', 'Barley')], 
                   'Peas': [('Peas', 'Oats', 'Corn'), ('Peas', 'Flaxseed', 'Peas')], 
                   'Corn':[('Corn', 'Fallow'), ('Corn', 'Soybeans'), ('Corn', 'Wheat', 'Clover')], 
                   'Soy': [('Soy', 'Fallow'), ('Soy', 'Corn'), ('Soy', 'Wheat', 'Canola')]}
    
    markdown_str = "##### "+selected_crop_iy+" Rotations at the Neighbourhood Level:\n"
    for rotation in county_rots[selected_crop_iy]:
        markdown_str += f"- {' -> '.join(rotation)}\n"
    # Display the bullet list in Streamlit
    st.markdown(markdown_str)
    
    

#     national_rots = [['Flaxseed', 20.51, 10.35, 5.09, 9.59, 4.84, 13.24, 18.89, 7.25, 10.24],
#                             ['Wheat', 18.24, 16.8, 15.99, 3.02, 5.84, 4.17, 13.7, 6.23, 16.01],
#                             ['Barley', 17.89, 13.75, 3.54, 10.26, 11.57, 12.66, 9.86, 10.32, 10.15],
#                             ['Oats', 4.72, 16.11, 8.98, 10.38, 10.87, 9.89, 12.63, 15.36, 11.06],
#                             ['Canola', 11.58, 13.9, 19.02, 4.4, 4.48, 3.41, 11.21, 9.3, 22.7],
#                             ['Peas', 16.17, 17.38, 8.11, 9.41, 4.35, 14.29, 7.86, 8.68, 13.75],
#                             ['Corn', 13.17, 13.88, 12.21, 8.35, 2.53, 16.73, 4.25, 11.94, 16.94],
#                             ['Soy', 13.26, 5.75, 20.06, 7.9, 11.25, 10.51, 13.52, 8.8, 8.95]]
#     national_rots = pd.DataFrame(national_rots, columns=["", "Flaxseed", "Wheat", "Barley", "Oats", "Canola", "Peas", "Corn", "Soy", "Other"])
#     numeric_columns = national_rots.select_dtypes(include=[np.number]).columns
#     national_rots[numeric_columns] = national_rots[numeric_columns].applymap(lambda x: f'{x:.2f}%')
    
#     st.write(national_rots.to_html(index=False), unsafe_allow_html=True)

    national_rots = {'Flaxseed': [('Flaxseed', 'Legume'), ('Flaxseed', 'Wheat'), ('Flaxseed', 'Corn', 'Soy')],
                    'Wheat': [('Wheat', 'Barley'), ('Wheat', 'Peas'), ('Wheat', 'Flaxseed', 'Wheat')],
                    'Barley': [('Barley', 'Canola'), ('Barley', 'Wheat', 'Peas')],
                    'Oats': [('Oats', 'Barley', 'Soy'), ('Oats', 'Peas', 'Corn'), ('Oats', 'Fallow')],
                    'Canola': [('Canola', 'Oats'), ('Canola', 'Peas', 'Corn'), ('Canola', 'Flaxseed')],
                    'Peas': [('Peas', 'Canola', 'Barley'), ('Peas', 'Wheat', 'Oats')],
                    'Corn': [('Corn', 'Oats'), ('Corn', 'Barley'), ('Corn', 'Flaxseed')],
                    'Soy': [('Soy', 'Wheat'), ('Soy', 'Barley'), ('Soy', 'Flaxseed')]}
    
    markdown_str = "##### "+selected_crop_iy+" Rotations at the National Level:\n"
    for rotation in national_rots[selected_crop_iy]:
        markdown_str += f"- {' -> '.join(rotation)}\n"
    # Display the bullet list in Streamlit
    st.markdown(markdown_str)



    
    





