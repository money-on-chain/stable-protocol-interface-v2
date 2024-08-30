import React, { Fragment, useContext, useEffect, useState } from 'react';
import './Styles.scss';

export default function HomeTabs(props) {
    return (
        <div className="tab__container">
            {/* Antes */}
            {/* <div class="tabs">
    <input type="radio" id="tab1" name="tab-group" checked>
    <label for="tab1">Tab 1</label>

    <input type="radio" id="tab2" name="tab-group">
    <label for="tab2">Tab 2</label>
</div> */}
            {/* Despues */}
            <div>Portfolio</div>
            <div>Last Operations</div>
        </div>
    );
}
