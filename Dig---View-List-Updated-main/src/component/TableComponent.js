import React, { useState, useMemo } from 'react';

const districts = {
  Namakal: [
    { motherVillage: 'Namakal', hamletVillage: ['Namakal', 'Erumapatty', 'Mohanur', 'Sendamangalam', 'V.V.Nadu', 'Sengarai', 'Puduchatram', 'Nallipalayam'] },
    { motherVillage: 'Rasipuram', hamletVillage: ['Rasipuram', 'Vennandur', 'Nanagiripet', 'Belukurichi', 'Ayilpatty', 'Mangalapuram'] },
    { motherVillage: 'Tiruchengode', hamletVillage: ['T.gode Town', 'T.gode Rural', 'Mallasamudram', 'Elachipalayam', 'Pallipalayam', 'Molasi', 'Veppadai', 'Komarupalayam'] },
    { motherVillage: 'Velur', hamletVillage: ['Velur', 'Paramathi', 'Jedarpalayam', 'V.G.Patty', 'Nallur'] },
  ],
  Salem: [
    { motherVillage: 'Salem', hamletVillage: ['Kandhampatty', 'Kannankurichi'] },
    { motherVillage: 'Omalur', hamletVillage: ['Kollapatty', 'Omalur', 'Salem City'] },
    { motherVillage: 'Attur', hamletVillage: ['Elampillai', '', 'Kalipatti'] },
    { motherVillage: 'Mettur', hamletVillage: ['Muthampatti', 'Thoppur', 'Mettur'] },
  ],
};

const initialItems = [
  { id: 1, idolId: 12, hamletVillage: 'Namakal', place: 'Lake', type: 'Public', date: '2024-08-20', status: 'INCOMPLETE', district: 'Namakal' },
  { id: 2, idolId: 123, hamletVillage: 'Erumapatty', place: 'River', type: 'Private', date: '2024-08-21', status: 'COMPLETE', district: 'Namakal' },
  { id: 3, idolId: 1234, hamletVillage: 'Thoppur', place: 'Ashram', type: 'Organisation', date: '2024-08-22', status: 'INCOMPLETE', district: 'Salem' },
];

function App() {
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [selectedPoliceStation, setSelectedPoliceStation] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); 

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleStatusFilter = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
    setSelectedPlace('');
    setSelectedPoliceStation('');
  };

  const handlePlaceChange = (event) => {
    setSelectedPlace(event.target.value);
    setSelectedPoliceStation('');
  };

  const handlePoliceStationChange = (event) => {
    setSelectedPoliceStation(event.target.value);
  };

  const handleTypeFilter = (event) => {
    setTypeFilter(event.target.value);
  };

  const filteredData = useMemo(() => {
    const districtPlaces = districts[selectedDistrict] || [];
    const placeData = districtPlaces.find(place => place.motherVillage === selectedPlace);
    const validLocations = placeData ? [selectedPlace, ...placeData.hamletVillage] : [];

    return initialItems.filter((item) =>
      (selectedDistrict === '' || item.district === selectedDistrict) &&
      (validLocations.length === 0 || validLocations.includes(item.hamletVillage)) &&
      (selectedPoliceStation === '' || item.hamletVillage === selectedPoliceStation) &&
      (statusFilter === 'all' || item.status === statusFilter) &&
      (selectedDate === '' || item.date === selectedDate) &&
      (typeFilter === 'all' || item.type === typeFilter)
    );
  }, [selectedDistrict, selectedPlace, selectedPoliceStation, statusFilter, selectedDate, typeFilter]);

  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;
    return [...filteredData].sort((a, b) => {
      if (a[sortField] < b[sortField]) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (a[sortField] > b[sortField]) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortField, sortOrder]);

  const selectedPlaceData = districts[selectedDistrict]?.find(place => place.motherVillage === selectedPlace);

  const headerText = selectedPlace ? `${selectedPlace} Branch` : '';

  return (
    <div>
      <h1>{headerText}</h1>
      <div>
        <label>
          District:
          <select value={selectedDistrict} onChange={handleDistrictChange}>
            <option value="">Select District</option>
            {Object.keys(districts).map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </label>
        <label>
          Sub-Division:
          <select value={selectedPlace} onChange={handlePlaceChange}>
            <option value="">Select Place</option>
            {districts[selectedDistrict]?.map(place => (
              <option key={place.motherVillage} value={place.motherVillage}>{place.motherVillage}</option>
            ))}
          </select>
        </label>
        <label>
          Police Station:
          <select value={selectedPoliceStation} onChange={handlePoliceStationChange}>
            <option value="">Select Police Station</option>
            {selectedPlaceData?.hamletVillage.map(subPlace => (
              <option key={subPlace} value={subPlace}>{subPlace}</option>
            ))}
          </select>
        </label>
        <label>
          Type:
          <select value={typeFilter} onChange={handleTypeFilter}>
            <option value="all">All</option>
            <option value="Public">Public</option>
            <option value="Private">Private</option>
            <option value="Organisation">Organisation</option>
          </select>
        </label>
        <label>
          Status:
          <select value={statusFilter} onChange={handleStatusFilter}>
            <option value="all">All</option>
            <option value="COMPLETE">Complete</option>
            <option value="INCOMPLETE">Incomplete</option>
          </select>
        </label>
        <label>
          Date:
          <input type="date" value={selectedDate} onChange={handleDateChange} />
        </label>
      </div>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>ID</th>
            <th onClick={() => handleSort('idolId')}>Idol ID</th>
            <th onClick={() => handleSort('hamletVillage')}>Location of Installation</th>
            <th onClick={() => handleSort('place')}>Place of Immersion</th>
            <th onClick={() => handleSort('type')}>Type</th>
            <th onClick={() => handleSort('date')}>Date of Immersion</th>
            <th onClick={() => handleSort('status')}>Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.idolId}</td>
              <td>{item.hamletVillage}</td>
              <td>{item.place}</td>
              <td>{item.type}</td>
              <td>{item.date}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
