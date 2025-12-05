// Helper function to generate diverse customer data
const generateCustomers = () => {
    const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
        'Diya', 'Saanvi', 'Ananya', 'Aadhya', 'Pari', 'Anvi', 'Myra', 'Riya', 'Aarohi', 'Kiara',
        'Rahul', 'Priya', 'Amit', 'Sneha', 'Rohit', 'Neha', 'Vikram', 'Pooja', 'Suresh', 'Anjali',
        'Simran', 'Harpreet', 'Jasleen', 'Aakash', 'Kavya', 'Rohan', 'Shreya', 'Aryan', 'Tanvi',
        'Aditi', 'Karthik', 'Meera', 'Varun', 'Nisha', 'Siddharth', 'Priyanka', 'Arnav', 'Ravi',
        'Maria', 'Yash', 'Tanya', 'Kunal', 'Divya', 'Lakshmi', 'Rajesh', 'Sunita', 'Manoj', 'Geeta'];

    const lastNames = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Prasad', 'Gupta', 'Malhotra', 'Bhatia', 'Verma',
        'Mehta', 'Joshi', 'Nair', 'Saxena', 'Iyer', 'Desai', 'Chopra', 'Kapoor', 'Agarwal', 'Jain',
        'Rao', 'Mishra', 'Pandey', 'Das', 'Roy', 'Choudhury', 'Kaur', 'Yadav', 'Tripathi', 'Menon',
        'Pillai', 'Tiwari', 'Chouhan', 'Panda', 'Dash', 'Bora', 'Fernandes', 'D\'Souza', 'Rawat', 'Thakur',
        'Mahato', 'Sahu', 'Naidu', 'Banerjee', 'Chatterjee', 'Mukherjee', 'Ghosh', 'Dutta'];

    const cities = [
        // Maharashtra (15)
        { city: 'Mumbai', state: 'Maharashtra' },
        { city: 'Pune', state: 'Maharashtra' },
        { city: 'Nagpur', state: 'Maharashtra' },
        { city: 'Nashik', state: 'Maharashtra' },
        { city: 'Aurangabad', state: 'Maharashtra' },

        // Delhi (10)
        { city: 'Delhi', state: 'Delhi' },

        // Karnataka (12)
        { city: 'Bangalore', state: 'Karnataka' },
        { city: 'Mysore', state: 'Karnataka' },
        { city: 'Mangalore', state: 'Karnataka' },

        // Telangana (10)
        { city: 'Hyderabad', state: 'Telangana' },
        { city: 'Warangal', state: 'Telangana' },

        // Tamil Nadu (12)
        { city: 'Chennai', state: 'Tamil Nadu' },
        { city: 'Coimbatore', state: 'Tamil Nadu' },
        { city: 'Madurai', state: 'Tamil Nadu' },

        // West Bengal (10)
        { city: 'Kolkata', state: 'West Bengal' },
        { city: 'Howrah', state: 'West Bengal' },
        { city: 'Durgapur', state: 'West Bengal' },

        // Gujarat (12)
        { city: 'Ahmedabad', state: 'Gujarat' },
        { city: 'Surat', state: 'Gujarat' },
        { city: 'Vadodara', state: 'Gujarat' },
        { city: 'Rajkot', state: 'Gujarat' },

        // Rajasthan (10)
        { city: 'Jaipur', state: 'Rajasthan' },
        { city: 'Jodhpur', state: 'Rajasthan' },
        { city: 'Udaipur', state: 'Rajasthan' },

        // Punjab (8)
        { city: 'Ludhiana', state: 'Punjab' },
        { city: 'Amritsar', state: 'Punjab' },
        { city: 'Jalandhar', state: 'Punjab' },

        // Uttar Pradesh (15)
        { city: 'Lucknow', state: 'Uttar Pradesh' },
        { city: 'Kanpur', state: 'Uttar Pradesh' },
        { city: 'Agra', state: 'Uttar Pradesh' },
        { city: 'Varanasi', state: 'Uttar Pradesh' },
        { city: 'Noida', state: 'Uttar Pradesh' },

        // Bihar (8)
        { city: 'Patna', state: 'Bihar' },
        { city: 'Gaya', state: 'Bihar' },
        { city: 'Bhagalpur', state: 'Bihar' },

        // Kerala (10)
        { city: 'Kochi', state: 'Kerala' },
        { city: 'Thiruvananthapuram', state: 'Kerala' },
        { city: 'Kozhikode', state: 'Kerala' },
        { city: 'Thrissur', state: 'Kerala' },

        // Madhya Pradesh (8)
        { city: 'Indore', state: 'Madhya Pradesh' },
        { city: 'Bhopal', state: 'Madhya Pradesh' },
        { city: 'Jabalpur', state: 'Madhya Pradesh' },

        // Odisha (6)
        { city: 'Bhubaneswar', state: 'Odisha' },
        { city: 'Cuttack', state: 'Odisha' },

        // Assam (5)
        { city: 'Guwahati', state: 'Assam' },
        { city: 'Dibrugarh', state: 'Assam' },

        // Goa (4)
        { city: 'Panaji', state: 'Goa' },
        { city: 'Margao', state: 'Goa' },

        // Uttarakhand (4)
        { city: 'Dehradun', state: 'Uttarakhand' },
        { city: 'Haridwar', state: 'Uttarakhand' },

        // Himachal Pradesh (3)
        { city: 'Shimla', state: 'Himachal Pradesh' },

        // Jharkhand (4)
        { city: 'Ranchi', state: 'Jharkhand' },
        { city: 'Jamshedpur', state: 'Jharkhand' },

        // Chhattisgarh (4)
        { city: 'Raipur', state: 'Chhattisgarh' },
        { city: 'Bhilai', state: 'Chhattisgarh' },

        // Andhra Pradesh (6)
        { city: 'Visakhapatnam', state: 'Andhra Pradesh' },
        { city: 'Vijayawada', state: 'Vijayawada' },

        // Chandigarh (3)
        { city: 'Chandigarh', state: 'Chandigarh' },

        // Haryana (5)
        { city: 'Gurgaon', state: 'Haryana' },
        { city: 'Faridabad', state: 'Haryana' },
    ];

    const customers = [];
    for (let i = 0; i < 150; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const cityData = cities[i % cities.length];
        const totalSpent = Math.floor(Math.random() * 95000) + 1000; // $1,000 to $96,000
        const ordersCount = Math.floor(Math.random() * 20) + 1; // 1 to 20 orders

        customers.push({
            id: `gid://shopify/Customer/${1000 + i}`,
            firstName,
            lastName,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
            city: cityData.city,
            country: 'India',
            totalSpent,
            ordersCount
        });
    }

    return customers;
};

export const MOCK_CUSTOMERS = generateCustomers();

export const MOCK_PRODUCTS = [
    { id: 'gid://shopify/Product/201', title: 'Cotton Kurta', category: 'Clothing', price: 1200.00 },
    { id: 'gid://shopify/Product/202', title: 'Silk Saree', category: 'Clothing', price: 4500.00 },
    { id: 'gid://shopify/Product/203', title: 'Denim Jeans', category: 'Clothing', price: 2500.00 },
    { id: 'gid://shopify/Product/204', title: 'Leather Jacket', category: 'Clothing', price: 6000.00 },
    { id: 'gid://shopify/Product/205', title: 'Running Shoes', category: 'Footwear', price: 3500.00 },
    { id: 'gid://shopify/Product/206', title: 'Formal Shoes', category: 'Footwear', price: 4000.00 },
    { id: 'gid://shopify/Product/207', title: 'Wireless Earbuds', category: 'Electronics', price: 2000.00 },
    { id: 'gid://shopify/Product/208', title: 'Smart Watch', category: 'Electronics', price: 5000.00 },
    { id: 'gid://shopify/Product/209', title: 'Bluetooth Speaker', category: 'Electronics', price: 3000.00 },
    { id: 'gid://shopify/Product/210', title: 'Smartphone', category: 'Electronics', price: 15000.00 },
    { id: 'gid://shopify/Product/211', title: 'Laptop', category: 'Electronics', price: 45000.00 },
    { id: 'gid://shopify/Product/212', title: 'Tablet', category: 'Electronics', price: 20000.00 },
    { id: 'gid://shopify/Product/213', title: 'Backpack', category: 'Accessories', price: 1500.00 },
    { id: 'gid://shopify/Product/214', title: 'Sunglasses', category: 'Accessories', price: 2500.00 },
    { id: 'gid://shopify/Product/215', title: 'Wallet', category: 'Accessories', price: 800.00 },
    { id: 'gid://shopify/Product/216', title: 'Perfume', category: 'Beauty', price: 3500.00 },
    { id: 'gid://shopify/Product/217', title: 'Face Cream', category: 'Beauty', price: 1200.00 },
    { id: 'gid://shopify/Product/218', title: 'Hair Dryer', category: 'Beauty', price: 2000.00 },
    { id: 'gid://shopify/Product/219', title: 'Yoga Mat', category: 'Fitness', price: 1000.00 },
    { id: 'gid://shopify/Product/220', title: 'Dumbbells Set', category: 'Fitness', price: 3000.00 },
];

export const MOCK_ORDERS = [
    { id: 'gid://shopify/Order/301', customerId: 'gid://shopify/Customer/1001', productId: 'gid://shopify/Product/201', quantity: 2, totalPrice: 2400.00, currency: 'INR', createdAt: '2024-01-15T10:00:00.000Z' },
    { id: 'gid://shopify/Order/301b', customerId: 'gid://shopify/Customer/1002', productId: 'gid://shopify/Product/205', quantity: 1, totalPrice: 3500.00, currency: 'INR', createdAt: '2024-01-15T12:00:00.000Z' }, // Extra order
    { id: 'gid://shopify/Order/302', customerId: 'gid://shopify/Customer/1002', productId: 'gid://shopify/Product/210', quantity: 1, totalPrice: 15000.00, currency: 'INR', createdAt: '2024-01-16T10:00:00.000Z' },
    { id: 'gid://shopify/Order/303', customerId: 'gid://shopify/Customer/1003', productId: 'gid://shopify/Product/205', quantity: 1, totalPrice: 3500.00, currency: 'INR', createdAt: '2024-01-17T10:00:00.000Z' },
    { id: 'gid://shopify/Order/304', customerId: 'gid://shopify/Customer/1004', productId: 'gid://shopify/Product/202', quantity: 1, totalPrice: 4500.00, currency: 'INR', createdAt: '2024-01-18T10:00:00.000Z' },
    { id: 'gid://shopify/Order/304b', customerId: 'gid://shopify/Customer/1005', productId: 'gid://shopify/Product/203', quantity: 1, totalPrice: 2500.00, currency: 'INR', createdAt: '2024-01-18T14:00:00.000Z' }, // Extra order
    { id: 'gid://shopify/Order/305', customerId: 'gid://shopify/Customer/1005', productId: 'gid://shopify/Product/211', quantity: 1, totalPrice: 45000.00, currency: 'INR', createdAt: '2024-01-19T10:00:00.000Z' },
    { id: 'gid://shopify/Order/306', customerId: 'gid://shopify/Customer/1006', productId: 'gid://shopify/Product/208', quantity: 2, totalPrice: 10000.00, currency: 'INR', createdAt: '2024-01-20T10:00:00.000Z' },
    { id: 'gid://shopify/Order/307', customerId: 'gid://shopify/Customer/1007', productId: 'gid://shopify/Product/203', quantity: 1, totalPrice: 2500.00, currency: 'INR', createdAt: '2024-01-21T10:00:00.000Z' },
    { id: 'gid://shopify/Order/307b', customerId: 'gid://shopify/Customer/1008', productId: 'gid://shopify/Product/201', quantity: 1, totalPrice: 1200.00, currency: 'INR', createdAt: '2024-01-21T16:00:00.000Z' }, // Extra order
    { id: 'gid://shopify/Order/308', customerId: 'gid://shopify/Customer/1008', productId: 'gid://shopify/Product/212', quantity: 1, totalPrice: 20000.00, currency: 'INR', createdAt: '2024-01-22T10:00:00.000Z' },
    { id: 'gid://shopify/Order/309', customerId: 'gid://shopify/Customer/1009', productId: 'gid://shopify/Product/204', quantity: 1, totalPrice: 6000.00, currency: 'INR', createdAt: '2024-01-23T10:00:00.000Z' },
    { id: 'gid://shopify/Order/310', customerId: 'gid://shopify/Customer/1010', productId: 'gid://shopify/Product/207', quantity: 3, totalPrice: 6000.00, currency: 'INR', createdAt: '2024-01-24T10:00:00.000Z' },
    { id: 'gid://shopify/Order/311', customerId: 'gid://shopify/Customer/1011', productId: 'gid://shopify/Product/216', quantity: 2, totalPrice: 7000.00, currency: 'INR', createdAt: '2024-01-25T10:00:00.000Z' },
    { id: 'gid://shopify/Order/312', customerId: 'gid://shopify/Customer/1012', productId: 'gid://shopify/Product/206', quantity: 1, totalPrice: 4000.00, currency: 'INR', createdAt: '2024-01-26T10:00:00.000Z' },
    { id: 'gid://shopify/Order/313', customerId: 'gid://shopify/Customer/1013', productId: 'gid://shopify/Product/209', quantity: 1, totalPrice: 3000.00, currency: 'INR', createdAt: '2024-01-27T10:00:00.000Z' },
    { id: 'gid://shopify/Order/313b', customerId: 'gid://shopify/Customer/1014', productId: 'gid://shopify/Product/202', quantity: 1, totalPrice: 4500.00, currency: 'INR', createdAt: '2024-01-27T11:00:00.000Z' }, // Extra order
    { id: 'gid://shopify/Order/314', customerId: 'gid://shopify/Customer/1014', productId: 'gid://shopify/Product/214', quantity: 2, totalPrice: 5000.00, currency: 'INR', createdAt: '2024-01-28T10:00:00.000Z' },
    { id: 'gid://shopify/Order/315', customerId: 'gid://shopify/Customer/1015', productId: 'gid://shopify/Product/220', quantity: 1, totalPrice: 3000.00, currency: 'INR', createdAt: '2024-01-29T10:00:00.000Z' },
    { id: 'gid://shopify/Order/316', customerId: 'gid://shopify/Customer/1016', productId: 'gid://shopify/Product/201', quantity: 3, totalPrice: 3600.00, currency: 'INR', createdAt: '2024-01-30T10:00:00.000Z' },
    { id: 'gid://shopify/Order/317', customerId: 'gid://shopify/Customer/1017', productId: 'gid://shopify/Product/210', quantity: 1, totalPrice: 15000.00, currency: 'INR', createdAt: '2024-02-01T10:00:00.000Z' },
    { id: 'gid://shopify/Order/318', customerId: 'gid://shopify/Customer/1018', productId: 'gid://shopify/Product/211', quantity: 1, totalPrice: 45000.00, currency: 'INR', createdAt: '2024-02-02T10:00:00.000Z' },
    { id: 'gid://shopify/Order/319', customerId: 'gid://shopify/Customer/1019', productId: 'gid://shopify/Product/202', quantity: 2, totalPrice: 9000.00, currency: 'INR', createdAt: '2024-02-03T10:00:00.000Z' },
    { id: 'gid://shopify/Order/320', customerId: 'gid://shopify/Customer/1020', productId: 'gid://shopify/Product/205', quantity: 1, totalPrice: 3500.00, currency: 'INR', createdAt: '2024-02-04T10:00:00.000Z' },
    { id: 'gid://shopify/Order/321', customerId: 'gid://shopify/Customer/1021', productId: 'gid://shopify/Product/208', quantity: 1, totalPrice: 5000.00, currency: 'INR', createdAt: '2024-02-05T10:00:00.000Z' },
    { id: 'gid://shopify/Order/322', customerId: 'gid://shopify/Customer/1022', productId: 'gid://shopify/Product/212', quantity: 1, totalPrice: 20000.00, currency: 'INR', createdAt: '2024-02-06T10:00:00.000Z' },
    { id: 'gid://shopify/Order/323', customerId: 'gid://shopify/Customer/1023', productId: 'gid://shopify/Product/203', quantity: 2, totalPrice: 5000.00, currency: 'INR', createdAt: '2024-02-07T10:00:00.000Z' },
    { id: 'gid://shopify/Order/324', customerId: 'gid://shopify/Customer/1024', productId: 'gid://shopify/Product/204', quantity: 1, totalPrice: 6000.00, currency: 'INR', createdAt: '2024-02-08T10:00:00.000Z' },
    { id: 'gid://shopify/Order/325', customerId: 'gid://shopify/Customer/1025', productId: 'gid://shopify/Product/207', quantity: 2, totalPrice: 4000.00, currency: 'INR', createdAt: '2024-02-09T10:00:00.000Z' },
    { id: 'gid://shopify/Order/326', customerId: 'gid://shopify/Customer/1026', productId: 'gid://shopify/Product/216', quantity: 1, totalPrice: 3500.00, currency: 'INR', createdAt: '2024-02-10T10:00:00.000Z' },
    { id: 'gid://shopify/Order/327', customerId: 'gid://shopify/Customer/1027', productId: 'gid://shopify/Product/206', quantity: 2, totalPrice: 8000.00, currency: 'INR', createdAt: '2024-02-11T10:00:00.000Z' },
    { id: 'gid://shopify/Order/328', customerId: 'gid://shopify/Customer/1028', productId: 'gid://shopify/Product/209', quantity: 1, totalPrice: 3000.00, currency: 'INR', createdAt: '2024-02-12T10:00:00.000Z' },
    { id: 'gid://shopify/Order/329', customerId: 'gid://shopify/Customer/1029', productId: 'gid://shopify/Product/214', quantity: 1, totalPrice: 2500.00, currency: 'INR', createdAt: '2024-02-13T10:00:00.000Z' },
    { id: 'gid://shopify/Order/330', customerId: 'gid://shopify/Customer/1030', productId: 'gid://shopify/Product/220', quantity: 2, totalPrice: 6000.00, currency: 'INR', createdAt: '2024-02-14T10:00:00.000Z' },
    { id: 'gid://shopify/Order/331', customerId: 'gid://shopify/Customer/1031', productId: 'gid://shopify/Product/201', quantity: 1, totalPrice: 1200.00, currency: 'INR', createdAt: '2024-02-15T10:00:00.000Z' },
    { id: 'gid://shopify/Order/332', customerId: 'gid://shopify/Customer/1032', productId: 'gid://shopify/Product/210', quantity: 1, totalPrice: 15000.00, currency: 'INR', createdAt: '2024-02-16T10:00:00.000Z' },
    { id: 'gid://shopify/Order/333', customerId: 'gid://shopify/Customer/1033', productId: 'gid://shopify/Product/211', quantity: 1, totalPrice: 45000.00, currency: 'INR', createdAt: '2024-02-17T10:00:00.000Z' },
    { id: 'gid://shopify/Order/334', customerId: 'gid://shopify/Customer/1034', productId: 'gid://shopify/Product/202', quantity: 1, totalPrice: 4500.00, currency: 'INR', createdAt: '2024-02-18T10:00:00.000Z' },
    { id: 'gid://shopify/Order/335', customerId: 'gid://shopify/Customer/1035', productId: 'gid://shopify/Product/205', quantity: 2, totalPrice: 7000.00, currency: 'INR', createdAt: '2024-02-19T10:00:00.000Z' },
    { id: 'gid://shopify/Order/336', customerId: 'gid://shopify/Customer/1036', productId: 'gid://shopify/Product/208', quantity: 1, totalPrice: 5000.00, currency: 'INR', createdAt: '2024-02-20T10:00:00.000Z' },
    { id: 'gid://shopify/Order/337', customerId: 'gid://shopify/Customer/1037', productId: 'gid://shopify/Product/212', quantity: 1, totalPrice: 20000.00, currency: 'INR', createdAt: '2024-02-21T10:00:00.000Z' },
    { id: 'gid://shopify/Order/338', customerId: 'gid://shopify/Customer/1038', productId: 'gid://shopify/Product/203', quantity: 1, totalPrice: 2500.00, currency: 'INR', createdAt: '2024-02-22T10:00:00.000Z' },
    { id: 'gid://shopify/Order/339', customerId: 'gid://shopify/Customer/1039', productId: 'gid://shopify/Product/204', quantity: 1, totalPrice: 6000.00, currency: 'INR', createdAt: '2024-02-23T10:00:00.000Z' },
    { id: 'gid://shopify/Order/340', customerId: 'gid://shopify/Customer/1040', productId: 'gid://shopify/Product/207', quantity: 3, totalPrice: 6000.00, currency: 'INR', createdAt: '2024-02-24T10:00:00.000Z' },
    { id: 'gid://shopify/Order/341', customerId: 'gid://shopify/Customer/1041', productId: 'gid://shopify/Product/216', quantity: 1, totalPrice: 3500.00, currency: 'INR', createdAt: '2024-02-25T10:00:00.000Z' },
    { id: 'gid://shopify/Order/342', customerId: 'gid://shopify/Customer/1042', productId: 'gid://shopify/Product/206', quantity: 1, totalPrice: 4000.00, currency: 'INR', createdAt: '2024-02-26T10:00:00.000Z' },
    { id: 'gid://shopify/Order/343', customerId: 'gid://shopify/Customer/1043', productId: 'gid://shopify/Product/209', quantity: 2, totalPrice: 6000.00, currency: 'INR', createdAt: '2024-02-27T10:00:00.000Z' },
    { id: 'gid://shopify/Order/344', customerId: 'gid://shopify/Customer/1044', productId: 'gid://shopify/Product/214', quantity: 1, totalPrice: 2500.00, currency: 'INR', createdAt: '2024-02-28T10:00:00.000Z' },
    { id: 'gid://shopify/Order/345', customerId: 'gid://shopify/Customer/1045', productId: 'gid://shopify/Product/220', quantity: 1, totalPrice: 3000.00, currency: 'INR', createdAt: '2024-02-29T10:00:00.000Z' },
    { id: 'gid://shopify/Order/346', customerId: 'gid://shopify/Customer/1046', productId: 'gid://shopify/Product/201', quantity: 2, totalPrice: 2400.00, currency: 'INR', createdAt: '2024-03-01T10:00:00.000Z' },
    { id: 'gid://shopify/Order/347', customerId: 'gid://shopify/Customer/1047', productId: 'gid://shopify/Product/210', quantity: 1, totalPrice: 15000.00, currency: 'INR', createdAt: '2024-03-02T10:00:00.000Z' },
    { id: 'gid://shopify/Order/348', customerId: 'gid://shopify/Customer/1048', productId: 'gid://shopify/Product/211', quantity: 1, totalPrice: 45000.00, currency: 'INR', createdAt: '2024-03-03T10:00:00.000Z' },
    { id: 'gid://shopify/Order/349', customerId: 'gid://shopify/Customer/1049', productId: 'gid://shopify/Product/202', quantity: 1, totalPrice: 4500.00, currency: 'INR', createdAt: '2024-03-04T10:00:00.000Z' },
    { id: 'gid://shopify/Order/350', customerId: 'gid://shopify/Customer/1050', productId: 'gid://shopify/Product/205', quantity: 1, totalPrice: 3500.00, currency: 'INR', createdAt: '2024-03-05T10:00:00.000Z' },
    { id: 'gid://shopify/Order/351', customerId: 'gid://shopify/Customer/1001', productId: 'gid://shopify/Product/203', quantity: 1, totalPrice: 2500.00, currency: 'INR', createdAt: '2024-03-05T14:00:00.000Z' }, // Extra order
];

