import React, { useState, useEffect } from 'react';

const MultiSelectItems = ({
  currentMode,
  dropdownData,
  onChange,
  selectedValues,
  fields,
  enabled,
  id,
  className,
  allowCustomValue,
  mode
}) => {
  return (
    <div className={`border rounded px-1 ${className}`}>
      <MultiSelectComponent
        id={id}
        fields={fields}
        dataSource={dropdownData}
        allowCustomValue={allowCustomValue == true ? true : false}
        maximumSelectionLength={10}
        popupWidth="400px"
        mode={mode?mode:"CheckBox"}
        showSelectAll={true}
        showDropDownIcon={enabled == false ? enabled : true}
        filterBarPlaceholder="Search ..."
        popupHeight="400px"
        onChange={onChange}
        value={selectedValues}
        enabled={enabled == false ? enabled : true}
      >
        <Inject
          services={[CheckBoxSelection]}
          style={{ border: "none", color: currentMode === "Dark" && "white" }}
        />
      </MultiSelectComponent>
    </div>
  );
};

export default MultiSelectItems;
