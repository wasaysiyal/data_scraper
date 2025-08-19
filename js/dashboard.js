function capitalizeFirstLetter(a){return a.charAt(0).toUpperCase()+a.slice(1)}

var table=new Tabulator("#example-table",{
    layout:"fitData",
    placeholder:"Loading",
    selectable:1,
    height:"400px",
    pagination:"local",
    paginationSize:50,
    paginationSizeSelector:[10,25,50,100],
    movableColumns:true,
    resizableRows:true,
    tooltips:true,
    columnDefaults:{
        tooltip:true,
        headerSort:true,
        resizable:true
    }
});

// Utility functions
function showLoading() {
    document.getElementById('loading-spinner').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading-spinner').classList.add('hidden');
}

function showDataStatus(message, type = 'info') {
    const statusEl = document.getElementById('datastatus');
    statusEl.textContent = message;
    statusEl.className = `mb-4 p-4 rounded-lg border ${type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 
                        type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 
                        'bg-blue-50 border-blue-200 text-blue-700'}`;
    statusEl.classList.remove('hidden');
    
    setTimeout(() => {
        statusEl.classList.add('hidden');
    }, 5000);
}

function updateStats(data) {
    const totalRecords = data.length;
    const validEmails = data.filter(item => item.email && item.email.includes('@')).length;
    const phoneNumbers = data.filter(item => item.phone && item.phone.length > 5).length;
    const websites = data.filter(item => item.website && item.website.startsWith('http')).length;
    
    document.getElementById('total-records').textContent = totalRecords.toLocaleString();
    document.getElementById('valid-emails').textContent = validEmails.toLocaleString();
    document.getElementById('phone-numbers').textContent = phoneNumbers.toLocaleString();
    document.getElementById('websites').textContent = websites.toLocaleString();
}

function flattenObject(a,c=""){
    const d={};
    for(const [b,e] of Object.entries(a)) {
        const key = c ? `${c}_${b}` : b;
        if(typeof e === 'object' && e !== null && !Array.isArray(e)) {
            Object.assign(d, flattenObject(e, key));
        } else {
            d[key] = e;
        }
    }
    return d;
}

function generateColumns(a){
    const c=new Set("name phone email website address instagram facebook twitter linkedin yelp youtube placeID cID category reviewCount averageRating latitude longitude".split(" "));
    var d=[];
    c.forEach(b=>{
        d.push({
            title:capitalizeFirstLetter(b),
            field:b,
            width:200,
            resizable:true,
            headerFilter:true
        });
    });
    Array.from(a).sort().forEach(b=>{
        if(!c.has(b)) {
            d.push({
                title:capitalizeFirstLetter(b),
                field:b,
                width:200,
                resizable:true,
                headerFilter:true
            });
        }
    });
    table.setColumns(d);
}

function showData(){
    chrome.storage.local.get(null,function(a){
        const data = a.leads || [];
        const flattenedData = [];
        const columns = new Set();
        
        for(let item of data) {
            const flattened = flattenObject(item);
            flattenedData.push(flattened);
            Object.keys(flattened).forEach(key => columns.add(key));
        }
        
        generateColumns(columns);
        table.setData(flattenedData);
        updateStats(flattenedData);
        
        if(data.length === 0) {
            showDataStatus('No data found. Extract some data from Google Maps first.', 'info');
        }
    });
}

// MongoDB Integration
async function saveToMongoDB(connectionString, collectionName, data) {
    try {
        showLoading();
        
        // For Chrome extension, we'll use a simple HTTP POST approach
        // This assumes you have a backend server running that can handle MongoDB operations
        const response = await fetch('http://localhost:3000/api/save-to-mongodb', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                connectionString: connectionString,
                collectionName: collectionName,
                data: data
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        hideLoading();
        return result;
    } catch (error) {
        hideLoading();
        throw error;
    }
}

// Alternative: Save to local storage as JSON for now
function saveDataLocally(data) {
    const timestamp = new Date().toISOString();
    const filename = `google_maps_data_${timestamp}.json`;
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showDataStatus(`Data saved locally as ${filename}`, 'success');
}

// Event Listeners
document.getElementById("download-csv").addEventListener("click",function(){
    rolecheck().then(function(a){
        const c=a.quota||0;
        var d=a.used||0;
        if(d<c){
            table.download("csv","google_maps_data.csv");
            const b=table.getRows().length;
            console.log(`download ${b} records.`);
            updateuse(b);
            d+=b;
            document.getElementById("accountinfo").innerHTML=`Current Plan: ${a.plan}, Quota: ${c}, Used: ${d}`;
            showDataStatus(`CSV file downloaded with ${b} records`, 'success');
        } else {
            alert("Download Quota Used UP, Please Upgrade your plan.");
            upgradeToPro();
        }
    }).catch(a=>{
        console.log(a);
        showDataStatus('Error downloading CSV', 'error');
    });
});

document.getElementById("download-xlsx").addEventListener("click",function(){
    rolecheck().then(function(a){
        const c=a.quota||0;
        var d=a.used||0;
        if(d<c){
            table.download("xlsx","google_maps_data.xlsx",{sheetName:"Google Maps Data"});
            const b=table.getRows().length;
            console.log(`download ${b} records.`);
            updateuse(b);
            d+=b;
            document.getElementById("accountinfo").innerHTML=`Current Plan: ${a.plan}, Quota: ${c}, Used: ${d}`;
            showDataStatus(`Excel file downloaded with ${b} records`, 'success');
        } else {
            alert("Download Quota Used UP, Please Upgrade your plan.");
            upgradeToPro();
        }
    }).catch(a=>{
        console.log(a);
        showDataStatus('Error downloading Excel', 'error');
    });
});

// MongoDB Save Button
document.getElementById("save-mongodb").addEventListener("click",function(){
    chrome.storage.local.get(null,function(a){
        const data = a.leads || [];
        if(data.length === 0) {
            showDataStatus('No data to save. Extract some data first.', 'error');
            return;
        }
        
        // Show MongoDB configuration modal
        document.getElementById('mongodb-modal').classList.remove('hidden');
    });
});

// MongoDB Modal Events
document.getElementById("cancel-mongo").addEventListener("click",function(){
    document.getElementById('mongodb-modal').classList.add('hidden');
});

document.getElementById("confirm-mongo").addEventListener("click",async function(){
    const connectionString = document.getElementById('mongo-uri').value.trim();
    const collectionName = document.getElementById('collection-name').value.trim() || 'google_maps_data';
    
    if(!connectionString) {
        showDataStatus('Please enter a MongoDB connection string', 'error');
        return;
    }
    
    try {
        chrome.storage.local.get(null, async function(a){
            const data = a.leads || [];
            const flattenedData = data.map(item => flattenObject(item));
            
            try {
                await saveToMongoDB(connectionString, collectionName, flattenedData);
                showDataStatus(`Successfully saved ${flattenedData.length} records to MongoDB`, 'success');
                document.getElementById('mongodb-modal').classList.add('hidden');
            } catch (error) {
                console.error('MongoDB save failed:', error);
                // Fallback to local save
                saveDataLocally(flattenedData);
                document.getElementById('mongodb-modal').classList.add('hidden');
            }
        });
    } catch (error) {
        console.error('Error:', error);
        showDataStatus('Error saving to database', 'error');
    }
});

// Refresh button
document.getElementById("refresh-data").addEventListener("click",function(){
    showLoading();
    setTimeout(() => {
        showData();
        hideLoading();
        showDataStatus('Data refreshed successfully', 'success');
    }, 1000);
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    showData();
    chrome.storage.sync.get(null,function(a){
        if(a.uid) {
            rolecheck().then(function(c){
                document.getElementById("accountinfo").innerHTML=`Current Plan: ${c.plan}, Quota: ${c.quota}, Used: ${c.used}`;
            }).catch(err => {
                console.error('Error checking role:', err);
            });
        }
    });
    
    // Load saved MongoDB settings
    chrome.storage.local.get(['mongoSettings'], function(result) {
        if(result.mongoSettings) {
            document.getElementById('mongo-uri').value = result.mongoSettings.connectionString || '';
            document.getElementById('collection-name').value = result.mongoSettings.collectionName || 'google_maps_data';
        }
    });
});

// Save MongoDB settings when changed
document.getElementById('mongo-uri').addEventListener('change', function() {
    chrome.storage.local.get(['mongoSettings'], function(result) {
        const settings = result.mongoSettings || {};
        settings.connectionString = document.getElementById('mongo-uri').value;
        chrome.storage.local.set({mongoSettings: settings});
    });
});

document.getElementById('collection-name').addEventListener('change', function() {
    chrome.storage.local.get(['mongoSettings'], function(result) {
        const settings = result.mongoSettings || {};
        settings.collectionName = document.getElementById('collection-name').value;
        chrome.storage.local.set({mongoSettings: settings});
    });
});

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    if(e.target.classList.contains('fixed') && e.target.classList.contains('inset-0')) {
        e.target.classList.add('hidden');
    }
});
