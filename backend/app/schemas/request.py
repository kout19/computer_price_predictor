"""
Request schema for the computer price prediction endpoint.

This module defines the exact input contract expected by
`computer_preprocessor.joblib`. Field names match the trained feature
set exactly (device_type, brand, release_year, ... megapixels).
Columns excluded at training time (model, cpu_model, gpu_model,
resolution) are intentionally absent and must never be added here.
"""

from typing import Any, Dict, Optional

from pydantic import BaseModel, ConfigDict, Field

_CURRENT_YEAR_UPPER_BOUND = 2035

print("=" * 60)
print("LOADED REQUEST.PY")
print(__file__)
print("=" * 60)
class PredictionRequest(BaseModel):
    """
    Input payload for a single computer price prediction.

    Every field corresponds directly to a feature consumed by
    `computer_preprocessor.joblib`. Fields that do not apply to every
    device type (e.g. `battery_wh` for desktops, `psu_watts` for
    laptops) are declared `Optional` and default to `None`, which the
    fitted preprocessing pipeline's imputers are expected to handle.

    Attributes
    ----------
    device_type : str
        Category of computing device (e.g. "Laptop", "Desktop", "AIO").
    brand : str
        Manufacturer brand.
    release_year : int
        Year the device was released.
    os : str
        Operating system installed.
    form_factor : str
        Physical form factor (e.g. "Slim", "Tower", "Mini").
    cpu_brand : str
        CPU manufacturer (e.g. "Intel", "AMD", "Apple").
    cpu_tier : str
        CPU performance tier (e.g. "i5", "Ryzen 7").
    cpu_cores : int
        Number of physical CPU cores.
    cpu_threads : int
        Number of logical CPU threads.
    cpu_base_ghz : float
        CPU base clock speed in GHz.
    cpu_boost_ghz : Optional[float]
        CPU maximum boost clock speed in GHz, if applicable.
    cpu_series : str
        CPU product series/family label.
    cpu_generation : str
        CPU generation label.
    cpu_suffix : Optional[str]
        CPU model suffix (e.g. "K", "H", "U").
    gpu_brand : str
        GPU manufacturer (e.g. "Nvidia", "AMD", "Intel").
    gpu_tier : str
        GPU performance tier label.
    gpu_family : str
        GPU product family label.
    gpu_generation : Optional[str]
        GPU generation label.
    gpu_suffix : Optional[str]
        GPU model suffix (e.g. "Ti", "XT").
    vram_gb : Optional[float]
        Dedicated video memory in gigabytes.
    ram_gb : int
        Installed system RAM in gigabytes.
    storage_type : str
        Primary storage technology (e.g. "SSD", "HDD", "NVMe").
    storage_gb : int
        Total storage capacity in gigabytes.
    storage_drive_count : int
        Number of physical storage drives installed.
    display_type : Optional[str]
        Display panel technology (e.g. "IPS", "OLED"), if applicable.
    display_size_in : Optional[float]
        Display diagonal size in inches, if applicable.
    refresh_hz : Optional[int]
        Display refresh rate in Hz, if applicable.
    battery_wh : Optional[float]
        Battery capacity in watt-hours, if applicable.
    charger_watts : Optional[float]
        Bundled charger/adapter wattage, if applicable.
    psu_watts : Optional[float]
        Power supply unit wattage, if applicable.
    wifi : str
        Wi-Fi standard supported (e.g. "Wi-Fi 6").
    bluetooth : str
        Bluetooth version supported (e.g. "5.2").
    weight_kg : Optional[float]
        Device weight in kilograms, if applicable.
    warranty_months : int
        Manufacturer warranty duration in months.
    resolution_width : int
        Display resolution width in pixels.
    resolution_height : int
        Display resolution height in pixels.
    megapixels : Optional[float]
        Webcam resolution in megapixels, if applicable.
    """
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": 
                {
                "device_type": "Laptop",
                "brand": "Dell",
                "release_year": 2024,
                "os": "Windows 11",
                "form_factor": "Slim",
                "cpu_brand": "Intel",
                "cpu_tier": 4,
                "cpu_cores": 14,
                "cpu_threads": 20,
                "cpu_base_ghz": 2.1,
                "cpu_boost_ghz": 4.8,
                "cpu_series": "Core Ultra",
                "cpu_generation": 13,
                "cpu_suffix": "H",
                "gpu_brand": "Nvidia",
                "gpu_tier": 4,
                "gpu_family": "Ada Lovelace",
                "gpu_generation": "40 Series",
                "gpu_suffix": None,
                "vram_gb": 8.0,
                "ram_gb": 16,
                "storage_type": "NVMe SSD",
                "storage_gb": 512,
                "storage_drive_count": 1,
                "display_type": "IPS",
                "display_size_in": 14.0,
                "refresh_hz": 120,
                "battery_wh": 63.0,
                "charger_watts": 100.0,
                "psu_watts": None,
                "wifi": "Wi-Fi 6E",
                "bluetooth": 5.3,
                "weight_kg": 1.6,
                "warranty_months": 12,
                "resolution_width": 1920,
                "resolution_height": 1200,
                "megapixels": 1.0,
            }
        }
    )

    # ------------------------------------------------------------------
    # General
    # ------------------------------------------------------------------
    device_type: str = Field(..., min_length=1, description="Category of computing device.")
    brand: str = Field(..., min_length=1, description="Manufacturer brand.")
    release_year: int = Field(
        ..., ge=1990, le=_CURRENT_YEAR_UPPER_BOUND, description="Year the device was released."
    )
    os: str = Field(..., min_length=1, description="Operating system installed.")
    form_factor: str = Field(..., min_length=1, description="Physical form factor.")

    # ------------------------------------------------------------------
    # CPU
    # ------------------------------------------------------------------
    cpu_brand: str = Field(..., min_length=1, description="CPU manufacturer.")
    cpu_tier: int= Field(..., ge=1, le=10, description="CPU performance tier.")
    cpu_cores: int = Field(..., ge=1, le=256, description="Number of physical CPU cores.")
    cpu_threads: int = Field(..., ge=1, le=512, description="Number of logical CPU threads.")
    cpu_base_ghz: float = Field(..., gt=0.0, le=10.0, description="CPU base clock speed in GHz.")
    cpu_boost_ghz: Optional[float] = Field(
        default=None, gt=0.0, le=10.0, description="CPU maximum boost clock speed in GHz."
    )
    cpu_series: str = Field(..., min_length=1, description="CPU product series/family label.")
    cpu_generation: int= Field(...,ge=1, le=30, description="CPU generation label.")
    cpu_suffix: Optional[str] = Field(default=None, description="CPU model suffix.")

    # ------------------------------------------------------------------
    # GPU
    # ------------------------------------------------------------------
    gpu_brand: str = Field(..., min_length=1, description="GPU manufacturer.")
    gpu_tier:  int= Field(..., ge=1, le=10, description="GPU performance tier label.")
    gpu_family: str = Field(..., min_length=1, description="GPU product family label.")
    gpu_generation: Optional[str] = Field(default=None, description="GPU generation label.")
    gpu_suffix: Optional[str] = Field(default=None, description="GPU model suffix.")
    vram_gb: Optional[float] = Field(
        default=None, ge=0.0, le=64.0, description="Dedicated video memory in gigabytes."
    )

    # ------------------------------------------------------------------
    # Memory & Storage
    # ------------------------------------------------------------------
    ram_gb: int = Field(..., ge=1, le=512, description="Installed system RAM in gigabytes.")
    storage_type: str = Field(..., min_length=1, description="Primary storage technology.")
    storage_gb: int = Field(..., ge=1, le=32000, description="Total storage capacity in gigabytes.")
    storage_drive_count: int = Field(
        ..., ge=1, le=8, description="Number of physical storage drives installed."
    )

    # ------------------------------------------------------------------
    # Display
    # ------------------------------------------------------------------
    display_type: Optional[str] = Field(default=None, description="Display panel technology.")
    display_size_in: Optional[float] = Field(
        default=None, gt=0.0, le=100.0, description="Display diagonal size in inches."
    )
    refresh_hz: Optional[int] = Field(
        default=None, ge=30, le=540, description="Display refresh rate in Hz."
    )
    resolution_width: int = Field(..., ge=640, le=15360, description="Display resolution width in pixels.")
    resolution_height: int = Field(..., ge=480, le=8640, description="Display resolution height in pixels.")

    # ------------------------------------------------------------------
    # Power
    # ------------------------------------------------------------------
    battery_wh: Optional[float] = Field(
        default=None, ge=0.0, le=300.0, description="Battery capacity in watt-hours."
    )
    charger_watts: Optional[float] = Field(
        default=None, ge=0.0, le=500.0, description="Bundled charger/adapter wattage."
    )
    psu_watts: Optional[float] = Field(
        default=None, ge=0.0, le=2000.0, description="Power supply unit wattage."
    )

    # ------------------------------------------------------------------
    # Connectivity
    # ------------------------------------------------------------------
    wifi: str = Field(..., min_length=1, description="Wi-Fi standard supported.")
    bluetooth: float = Field(..., ge=1.0,le=10, description="Bluetooth version supported.")

    # ------------------------------------------------------------------
    # Physical & Misc
    # ------------------------------------------------------------------
    weight_kg: Optional[float] = Field(
        default=None, gt=0.0, le=50.0, description="Device weight in kilograms."
    )
    warranty_months: int = Field(..., ge=0, le=120, description="Manufacturer warranty duration in months.")
    megapixels: Optional[float] = Field(
        default=None, ge=0.0, le=200.0, description="Webcam resolution in megapixels."
    )

    def to_feature_dict(self) -> Dict[str, Any]:
        """
        Convert the validated request into a plain feature dictionary.

        The keys match the column names expected by the fitted
        preprocessing pipeline exactly (snake_case, identical to the
        training dataset schema).

        Returns
        -------
        Dict[str, Any]
            Mapping of feature name to value, ready to be loaded into
            a single-row `pandas.DataFrame`.
        """
        return self.model_dump()
print("cpu_tier:", PredictionRequest.model_fields["cpu_tier"].annotation)
print("gpu_tier:", PredictionRequest.model_fields["gpu_tier"].annotation)
print("cpu_generation:", PredictionRequest.model_fields["cpu_generation"].annotation)
print("bluetooth:", PredictionRequest.model_fields["bluetooth"].annotation)