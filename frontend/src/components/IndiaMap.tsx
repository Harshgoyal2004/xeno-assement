"use client"

import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';

const INDIA_GEOJSON = '/india-states.json';

const COLOR_RANGE = [
    '#93c5fd', // Light Blue
    '#60a5fa',
    '#3b82f6',
    '#2563eb',
    '#1d4ed8'  // Deep Blue
];

const DEFAULT_COLOR = '#334155'; // Dark Slate for empty states

interface IndiaMapProps {
    data: { city: string; sales: number }[];
}

export default function IndiaMap({ data }: IndiaMapProps) {
    // Comprehensive city to state mapping for all 150 customers
    const cityToState: Record<string, string> = {
        // Maharashtra
        'Mumbai': 'Maharashtra',
        'Pune': 'Maharashtra',
        'Nagpur': 'Maharashtra',
        'Nashik': 'Maharashtra',
        'Aurangabad': 'Maharashtra',
        // Delhi
        'Delhi': 'Delhi',
        // Karnataka
        'Bangalore': 'Karnataka',
        'Mysore': 'Karnataka',
        'Mangalore': 'Karnataka',
        // Telangana
        'Hyderabad': 'Telangana',
        'Warangal': 'Telangana',
        // Tamil Nadu
        'Chennai': 'Tamil Nadu',
        'Coimbatore': 'Tamil Nadu',
        'Madurai': 'Tamil Nadu',
        // West Bengal
        'Kolkata': 'West Bengal',
        'Howrah': 'West Bengal',
        'Durgapur': 'West Bengal',
        // Gujarat
        'Ahmedabad': 'Gujarat',
        'Surat': 'Gujarat',
        'Vadodara': 'Gujarat',
        'Rajkot': 'Gujarat',
        // Rajasthan
        'Jaipur': 'Rajasthan',
        'Jodhpur': 'Rajasthan',
        'Udaipur': 'Rajasthan',
        // Punjab
        'Ludhiana': 'Punjab',
        'Amritsar': 'Punjab',
        'Jalandhar': 'Punjab',
        // Uttar Pradesh
        'Lucknow': 'Uttar Pradesh',
        'Kanpur': 'Uttar Pradesh',
        'Agra': 'Uttar Pradesh',
        'Varanasi': 'Uttar Pradesh',
        'Noida': 'Uttar Pradesh',
        // Bihar
        'Patna': 'Bihar',
        'Gaya': 'Bihar',
        'Bhagalpur': 'Bihar',
        // Kerala
        'Kochi': 'Kerala',
        'Thiruvananthapuram': 'Kerala',
        'Kozhikode': 'Kerala',
        'Thrissur': 'Kerala',
        // Madhya Pradesh
        'Indore': 'Madhya Pradesh',
        'Bhopal': 'Madhya Pradesh',
        'Jabalpur': 'Madhya Pradesh',
        // Odisha
        'Bhubaneswar': 'Odisha',
        'Cuttack': 'Odisha',
        // Assam
        'Guwahati': 'Assam',
        'Dibrugarh': 'Assam',
        // Goa
        'Panaji': 'Goa',
        'Margao': 'Goa',
        // Uttarakhand
        'Dehradun': 'Uttarakhand',
        'Haridwar': 'Uttarakhand',
        // Himachal Pradesh
        'Shimla': 'Himachal Pradesh',
        // Jharkhand
        'Ranchi': 'Jharkhand',
        'Jamshedpur': 'Jharkhand',
        // Chhattisgarh
        'Raipur': 'Chhattisgarh',
        'Bhilai': 'Chhattisgarh',
        // Andhra Pradesh
        'Visakhapatnam': 'Andhra Pradesh',
        'Vijayawada': 'Andhra Pradesh',
        // Chandigarh
        'Chandigarh': 'Chandigarh',
        // Haryana
        'Gurgaon': 'Haryana',
        'Faridabad': 'Haryana',
    };

    // Aggregate sales by state
    const stateSales: Record<string, number> = {};
    data.forEach(item => {
        const state = cityToState[item.city];
        if (state) {
            stateSales[state] = (stateSales[state] || 0) + item.sales;
        }
    });

    // Create color scale
    const colorScale = scaleQuantile<string>()
        .domain(Object.values(stateSales))
        .range(COLOR_RANGE);

    // Calculate quantile thresholds for legend
    const quantiles = colorScale.quantiles();
    const legendData = COLOR_RANGE.map((color, index) => {
        if (index === 0) {
            return { color, range: `₹0 - ₹${Math.round(quantiles[0]).toLocaleString()}` };
        } else if (index === COLOR_RANGE.length - 1) {
            return { color, range: `₹${Math.round(quantiles[quantiles.length - 1]).toLocaleString()}+` };
        } else {
            return {
                color,
                range: `₹${Math.round(quantiles[index - 1]).toLocaleString()} - ₹${Math.round(quantiles[index]).toLocaleString()}`
            };
        }
    });

    return (
        <div className="w-full h-full flex bg-card rounded-xl overflow-hidden">
            {/* Vertical Legend on Left */}
            <div className="w-48 border-r border-border p-4 flex flex-col">
                <h3 className="text-sm font-semibold mb-4 text-foreground">Sales Range</h3>
                <div className="flex flex-col gap-3 flex-1">
                    {legendData.map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                            <div
                                className="w-5 h-5 rounded flex-shrink-0 mt-0.5"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-xs text-muted-foreground leading-tight">{item.range}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Large Map */}
            <div className="flex-1 flex justify-center items-center p-2">
                <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{
                        scale: 1300,
                        center: [78.9629, 23.5937]
                    }}
                    width={1000}
                    height={800}
                    style={{ width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%" }}
                >
                    <Geographies geography={INDIA_GEOJSON}>
                        {({ geographies }) =>
                            geographies.map((geo) => {
                                const stateName = geo.properties.NAME_1;
                                const sales = stateSales[stateName] || 0;
                                const fillColor = sales > 0 ? colorScale(sales) : DEFAULT_COLOR;

                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        fill={fillColor}
                                        stroke="#FFFFFF"
                                        strokeWidth={0.5}
                                        style={{
                                            default: {
                                                outline: 'none',
                                            },
                                            hover: {
                                                fill: '#F53',
                                                outline: 'none',
                                                cursor: 'pointer',
                                            },
                                            pressed: {
                                                outline: 'none',
                                            },
                                        }}
                                    >
                                        <title>{`${stateName}: ₹${sales.toLocaleString()}`}</title>
                                    </Geography>
                                );
                            })
                        }
                    </Geographies>
                </ComposableMap>
            </div>
        </div>
    );
}
