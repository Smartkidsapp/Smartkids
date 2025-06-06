import { memo, useEffect, useState } from "react";

export const DAYS_LABELS = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
];

const TIMES = new Array(48).fill(0).map((_, i) => {
    const hours = Math.floor(i / 2)
        .toString()
        .padStart(2, "0");
    const minutes = i % 2 ? "30" : "00";
    return `${hours}h${minutes.padStart(2, "0")}`;
});

function WorkingHourItem({ day, onChange, value }) {
    const [currentValue, setCurrentValue] = useState(value);

    useEffect(() => {
        if (
            value.day != currentValue.day ||
            value.available != currentValue.available ||
            value.from != currentValue.from ||
            value.to != currentValue.to
        ) {
            setCurrentValue(value);
        }
    }, [value]);

    const onCurrentChange = (value) => {
        setCurrentValue((prev) => {
            return { ...prev, ...value };
        });
    };

    useEffect(() => {
        onChange?.(currentValue);
    }, [currentValue]);

    return (

        <div className="mb-3">
            <span className="mb-2">{DAYS_LABELS[day]}</span>
            <div className="day-row">
                <label className="custom-checkbox">
                    <input
                        type="checkbox"
                        checked={value.available}
                        onChange={(val) => onCurrentChange({ available: !value.available })}
                    />
                    <span className="checkbox-icon"></span>
                    <span className="checkbox-label">
                        {value.available ? "Ouvert" : "Fermé"}
                    </span>
                </label>
                <select
                    value={value.from}
                    onChange={(e) => onCurrentChange({ from: e.target.value })}
                    disabled={!value.available}
                >
                    {
                        TIMES.map((time) => (
                            <option key={time} value={time}>
                                {time}
                            </option>
                        ))
                    }
                </select>
                <span>à</span>
                <select
                    value={value.to}
                    onChange={(e) => onCurrentChange({ to: e.target.value })}
                    disabled={!value.available}
                >
                    {
                        TIMES.map((time) => (
                            <option key={time} value={time}>
                                {time}
                            </option>
                        ))
                    }
                </select>
            </div>
        </div>
    );
}

export default memo(WorkingHourItem, (prev, next) => {
    return (
        prev.day === next.day &&
        prev.value.available === next.value.available &&
        prev.value.from === next.value.from &&
        prev.value.to === next.value.to
    );
});
