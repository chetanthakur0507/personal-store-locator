'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface StoreSection {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  category: string;
}

export default function StoreMapPage() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Store layout sections
  const storeSections: StoreSection[] = [
    { id: '1', name: 'Fresh Produce', x: 10, y: 10, width: 180, height: 120, color: '#10b981', category: 'produce' },
    { id: '2', name: 'Dairy & Eggs', x: 200, y: 10, width: 140, height: 120, color: '#f59e0b', category: 'dairy' },
    { id: '3', name: 'Bakery', x: 350, y: 10, width: 140, height: 120, color: '#ef4444', category: 'bakery' },
    { id: '4', name: 'Meat & Seafood', x: 500, y: 10, width: 180, height: 120, color: '#ec4899', category: 'meat' },
    { id: '5', name: 'Frozen Foods', x: 10, y: 140, width: 150, height: 100, color: '#3b82f6', category: 'frozen' },
    { id: '6', name: 'Beverages', x: 170, y: 140, width: 150, height: 100, color: '#8b5cf6', category: 'beverages' },
    { id: '7', name: 'Snacks', x: 330, y: 140, width: 150, height: 100, color: '#f97316', category: 'snacks' },
    { id: '8', name: 'Household', x: 490, y: 140, width: 190, height: 100, color: '#06b6d4', category: 'household' },
    { id: '9', name: 'Personal Care', x: 10, y: 250, width: 180, height: 100, color: '#a855f7', category: 'personal' },
    { id: '10', name: 'Health & Wellness', x: 200, y: 250, width: 180, height: 100, color: '#14b8a6', category: 'health' },
    { id: '11', name: 'Pet Supplies', x: 390, y: 250, width: 140, height: 100, color: '#f472b6', category: 'pets' },
    { id: '12', name: 'Checkout', x: 540, y: 250, width: 140, height: 100, color: '#64748b', category: 'checkout' },
  ];

  const filteredSections = storeSections.filter(section =>
    section.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedSectionData = storeSections.find(s => s.id === selectedSection);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDF1] via-white to-[#FFF5E6]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-[#FF9644] hover:text-[#E67E00] mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Interactive Store Map</h1>
          <p className="text-gray-600">Click on any section to view details and find items</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search for a section..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF9644] focus:border-transparent"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Store Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="relative w-full" style={{ aspectRatio: '690/360' }}>
                <svg
                  viewBox="0 0 690 360"
                  className="w-full h-full border-2 border-gray-200 rounded-lg"
                  style={{ backgroundColor: '#f8fafc' }}
                >
                  {/* Store sections */}
                  {filteredSections.map((section) => (
                    <g
                      key={section.id}
                      onClick={() => setSelectedSection(section.id)}
                      className="cursor-pointer transition-all"
                      style={{ transition: 'all 0.3s' }}
                    >
                      <rect
                        x={section.x}
                        y={section.y}
                        width={section.width}
                        height={section.height}
                        fill={section.color}
                        opacity={selectedSection === section.id ? 1 : 0.7}
                        stroke={selectedSection === section.id ? '#1f2937' : '#fff'}
                        strokeWidth={selectedSection === section.id ? 3 : 2}
                        rx="8"
                        className="hover:opacity-100"
                      />
                      <text
                        x={section.x + section.width / 2}
                        y={section.y + section.height / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize="14"
                        fontWeight="bold"
                        style={{ pointerEvents: 'none', userSelect: 'none' }}
                      >
                        {section.name}
                      </text>
                    </g>
                  ))}

                  {/* Entrance marker */}
                  <g>
                    <rect x="310" y="355" width="70" height="5" fill="#10b981" />
                    <text x="345" y="350" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#10b981">
                      ENTRANCE
                    </text>
                  </g>
                </svg>
              </div>

              {/* Legend */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-3">Map Legend</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {storeSections.slice(0, 6).map((section) => (
                    <div key={section.id} className="flex items-center">
                      <div
                        className="w-4 h-4 rounded mr-2"
                        style={{ backgroundColor: section.color }}
                      ></div>
                      <span className="text-sm text-gray-700">{section.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              {selectedSectionData ? (
                <div>
                  <div
                    className="w-full h-24 rounded-lg mb-4"
                    style={{ backgroundColor: selectedSectionData.color }}
                  ></div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedSectionData.name}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Location: Aisle {parseInt(selectedSectionData.id) <= 4 ? 'A' : parseInt(selectedSectionData.id) <= 8 ? 'B' : 'C'}
                  </p>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Typical Items:</h3>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {selectedSectionData.category === 'produce' && (
                        <>
                          <li>• Fresh fruits</li>
                          <li>• Vegetables</li>
                          <li>• Organic produce</li>
                        </>
                      )}
                      {selectedSectionData.category === 'dairy' && (
                        <>
                          <li>• Milk & cream</li>
                          <li>• Cheese</li>
                          <li>• Eggs & butter</li>
                        </>
                      )}
                      {selectedSectionData.category === 'bakery' && (
                        <>
                          <li>• Fresh bread</li>
                          <li>• Pastries</li>
                          <li>• Cakes & cookies</li>
                        </>
                      )}
                      {selectedSectionData.category === 'meat' && (
                        <>
                          <li>• Fresh meat</li>
                          <li>• Seafood</li>
                          <li>• Deli items</li>
                        </>
                      )}
                      {selectedSectionData.category === 'frozen' && (
                        <>
                          <li>• Frozen meals</li>
                          <li>• Ice cream</li>
                          <li>• Frozen vegetables</li>
                        </>
                      )}
                      {selectedSectionData.category === 'beverages' && (
                        <>
                          <li>• Soft drinks</li>
                          <li>• Juices</li>
                          <li>• Water & tea</li>
                        </>
                      )}
                      {selectedSectionData.category === 'snacks' && (
                        <>
                          <li>• Chips & crackers</li>
                          <li>• Candy & chocolate</li>
                          <li>• Nuts & dried fruits</li>
                        </>
                      )}
                      {selectedSectionData.category === 'household' && (
                        <>
                          <li>• Cleaning supplies</li>
                          <li>• Paper products</li>
                          <li>• Laundry items</li>
                        </>
                      )}
                      {selectedSectionData.category === 'personal' && (
                        <>
                          <li>• Toiletries</li>
                          <li>• Cosmetics</li>
                          <li>• Hair care</li>
                        </>
                      )}
                      {selectedSectionData.category === 'health' && (
                        <>
                          <li>• Vitamins</li>
                          <li>• First aid</li>
                          <li>• OTC medicines</li>
                        </>
                      )}
                      {selectedSectionData.category === 'pets' && (
                        <>
                          <li>• Pet food</li>
                          <li>• Pet toys</li>
                          <li>• Pet accessories</li>
                        </>
                      )}
                      {selectedSectionData.category === 'checkout' && (
                        <>
                          <li>• Payment counters</li>
                          <li>• Customer service</li>
                          <li>• Exit area</li>
                        </>
                      )}
                    </ul>
                  </div>

                  <Link
                    href={`/user/search?category=${selectedSectionData.category}`}
                    className="block w-full text-center bg-[#FF9644] text-white py-3 rounded-lg font-semibold hover:bg-[#E67E00] transition"
                  >
                    View Items in this Section
                  </Link>
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  <p className="text-gray-500">Click on a section to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Navigation Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Click to Explore</h3>
                <p className="text-sm text-gray-600">Click on any colored section to see what items are available there.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Search Sections</h3>
                <p className="text-sm text-gray-600">Use the search bar to quickly find specific store sections.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Plan Your Route</h3>
                <p className="text-sm text-gray-600">Start from the entrance and plan an efficient shopping route.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
