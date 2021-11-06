import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';

function RaceDetails() {
    const [value1, setValue1] = useState('');
    const [value2, setValue2] = useState('');
    const [value3, setValue3] = useState('');
    const [value4, setValue4] = useState('');
    const [value5, setValue5] = useState('');

    return (
        <div>
            <div className="card">
                <h5>Basic</h5>
                <InputText value={value1} onChange={(e) => setValue1(e.target.value)} />
                <span className="p-ml-2">{value1}</span>

                <h5>Floating Label</h5>
                <span className="p-float-label">
                    <InputText id="username" value={value2} onChange={(e) => setValue2(e.target.value)} />
                    <label htmlFor="username">Username</label>
                </span>

                <h5>Left Icon</h5>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={value3} onChange={(e) => setValue3(e.target.value)} placeholder="Search" />
                </span>

                <h5>Right Icon</h5>
                <span className="p-input-icon-right">
                    <i className="pi pi-spin pi-spinner" />
                    <InputText value={value4} onChange={(e) => setValue4(e.target.value)} />
                </span>

                <h5>Help Text</h5>
                <div className="p-field">
                    <label htmlFor="username1" className="p-d-block">Username</label>
                    <InputText id="username1" aria-describedby="username1-help" className="p-d-block"/>
                    <small id="username1-help" className="p-d-block">Enter your username to reset your password.</small>
                </div>

                <h5>Invalid</h5>
                <div className="p-field">
                    <label htmlFor="username2" className="p-d-block">Username</label>
                    <InputText id="username2" aria-describedby="username2-help" className="p-invalid p-d-block" />
                    <small id="username2-help" className="p-error p-d-block">Username is not available.</small>
                </div>

                <h5>Disabled</h5>
                <InputText value={value5} disabled />

                <h5>Sizes</h5>
                <div className="sizes">
                    <InputText type="text" className="p-inputtext-sm p-d-block p-mb-2" placeholder="Small" />
                    <InputText type="text" className="p-d-block p-mb-2" placeholder="Normal" />
                    <InputText type="text" className="p-inputtext-lg p-d-block"  placeholder="Large" />
                </div>
            </div>
        </div>
    )
}
                
export default RaceDetails;