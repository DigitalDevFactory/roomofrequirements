
export interface MeasurementField {
    Waist?: string;
    Hip?: string;
    Length?: string;
    Knee?: string;
    Bottom?: string;
    Genou?: string;
    FR?: string;
    Jambe?: string;
    Mollet?: string;
    Plis?: boolean;
    Revers?: boolean;
    Buckle?: boolean;
    Collar?: string;
    XB?: string;
    Chest?: string;
    Sleeve_length?: string;
    Around_arm?: string;
    [key: string]: any;
    // Add fields for other item types if needed
}

export interface MeasurementFields {
    pants: MeasurementField;
    shirts: MeasurementField;
    // Add other item types if needed
}



export interface MeasurementsTableProps {
    customer: CustomerData;
    measurements: any[];
    headers: string[];
    formatRow: (row: any) => (JSX.Element | string | number)[];
}



export interface shirtsMeasurements {
    id: string;
    date_added: string;
    Collar: number;
    XB: number;
    Chest: number;
    Waist: number;
    Length: number;
    Sleeve_length: number;
    Around_arm: number;
    xata: Xata;
    // ... other shirt measurement fields
};

export interface pantsMeasurements {
    id: string;
    date_added: string;
    Waist: number;
    Hip: number;
    Knee: number;
    FR: number;
    Jambe: number;
    Genou: number;
    Length: number;
    Bottom: number;
    Mollet: number;
    xata: Xata;
    // ... other pants measurement fields
};


export interface CustomerProfileProps {
    customer: CustomerData;
    pantsMeasurements: pantsMeasurements[];
    shirtsMeasurements: shirtsMeasurements[];
}

export type Contact = {
    id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    image_url: string;
    image: CustomFile | null;
};


export type CustomerData = {
    id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    image_url: string;
    image: CustomFile
};

interface CustomFile extends File {
    url: string;
}


export type Xata = {
    createdAt: string;
    // Add any other fields of 'xata' here
};

export type RowStateType = {
    [key: string]: {
        isEditable: boolean;
        isUpdated: boolean;
    };
};

export interface Row {
    id: string;
    row: pantsMeasurements | shirtsMeasurements;
    // ... other fields
}

export interface EditedRow {
    id: string;
    row: pantsMeasurements | shirtsMeasurements;
    // ... your fields
}

export interface RowState {
    isEditable: boolean;
    isUpdated: boolean;
}

export interface OrderTypes {
    id: string;
    type_name: string;
    xata: Xata;
}