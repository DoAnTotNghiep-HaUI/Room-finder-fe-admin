export interface Room {
  id: string;
  roomNumber: string;
  buildingName: string;
  buildingCode: string;
  price: number;
}

export interface Contract {
  id: string;
  roomId: string;
  tenantName: string;
  contractCode: string;
  buildingCode: string;
  startDate: Date;
  endDate: Date;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
}

// Mock data for rooms
const mockRooms: Room[] = [
  {
    id: "room-1",
    roomNumber: "101",
    buildingName: "Building A",
    buildingCode: "BLDG-A",
    price: 3000000,
  },
  {
    id: "room-2",
    roomNumber: "102",
    buildingName: "Building A",
    buildingCode: "BLDG-A",
    price: 3500000,
  },
  {
    id: "room-3",
    roomNumber: "201",
    buildingName: "Building B",
    buildingCode: "BLDG-B",
    price: 4000000,
  },
  {
    id: "room-4",
    roomNumber: "202",
    buildingName: "Building B",
    buildingCode: "BLDG-B",
    price: 4500000,
  },
];

// Mock data for contracts
const mockContracts: Contract[] = [
  {
    id: "contract-1",
    roomId: "room-1",
    tenantName: "Nguyen Van A",
    contractCode: "CTR-001",
    buildingCode: "BLDG-A",
    startDate: new Date("2023-01-01"),
    endDate: new Date("2023-12-31"),
  },
  {
    id: "contract-2",
    roomId: "room-2",
    tenantName: "Tran Thi B",
    contractCode: "CTR-002",
    buildingCode: "BLDG-A",
    startDate: new Date("2023-02-01"),
    endDate: new Date("2024-01-31"),
  },
  {
    id: "contract-3",
    roomId: "room-3",
    tenantName: "Le Van C",
    contractCode: "CTR-003",
    buildingCode: "BLDG-B",
    startDate: new Date("2023-03-01"),
    endDate: new Date("2024-02-29"),
  },
  {
    id: "contract-4",
    roomId: "room-4",
    tenantName: "Pham Thi D",
    contractCode: "CTR-004",
    buildingCode: "BLDG-B",
    startDate: new Date("2023-04-01"),
    endDate: new Date("2024-03-31"),
  },
];

// Mock data for services
const mockServices: Service[] = [
  {
    id: "service-1",
    name: "WiFi",
    price: 100000,
    description: "Internet connection",
  },
  {
    id: "service-2",
    name: "Laundry",
    price: 50000,
    description: "Laundry service per person",
  },
  {
    id: "service-3",
    name: "Motorbike Parking",
    price: 100000,
    description: "Parking for motorbikes",
  },
  {
    id: "service-4",
    name: "Bicycle Parking",
    price: 50000,
    description: "Parking for bicycles",
  },
  {
    id: "service-5",
    name: "Cleaning",
    price: 200000,
    description: "Room cleaning service",
  },
];

// Simulate API calls with delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Fetch all rooms
export const fetchRooms = async (): Promise<Room[]> => {
  await delay(500); // Simulate network delay
  return [...mockRooms];
};

// Fetch contract by room ID
export const fetchContract = async (roomId: string): Promise<Contract> => {
  await delay(300); // Simulate network delay
  const contract = mockContracts.find((c) => c.roomId === roomId);

  if (!contract) {
    throw new Error(`No contract found for room ID: ${roomId}`);
  }

  return { ...contract };
};

// Fetch all services
export const fetchServices = async (): Promise<Service[]> => {
  await delay(400); // Simulate network delay
  return [...mockServices];
};
