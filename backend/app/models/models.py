from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base
from pgvector.sqlalchemy import Vector

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    status = Column(String, default="Abierto")
    priority = Column(String, default="P3")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    client = Column(String, default="General")
    vendor_case_id = Column(String, nullable=True)
    service_category = Column(String, nullable=True)
    service_name = Column(String, nullable=True)
    requester_name = Column(String, nullable=True)
    serial_number = Column(String, nullable=True)
    scenario_id = Column(String, nullable=True)
    assigned_engineer = Column(String, nullable=True)
    
    # P7M6 & Time Tracking
    ticket_type = Column(String, default="incident") # incident, request
    
    # Timestamps
    attention_start_at = Column(DateTime(timezone=True), server_default=func.now())
    attention_end_at = Column(DateTime(timezone=True), nullable=True)
    resolution_start_at = Column(DateTime(timezone=True), nullable=True)
    resolution_end_at = Column(DateTime(timezone=True), nullable=True)
    closed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Customer Confirmation
    customer_confirmed = Column(Boolean, default=False)
    customer_confirmed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Steps Data (JSON stored as String for broad compatibility or proper JSON type)
    current_step = Column(Integer, default=0) # 0=Not started, 1-7=P7M6 Steps
    step_data = Column(Text, default="{}") # Stores evidence, analysis per step
    ai_scores = Column(Text, default="{}") # Stores AI validation scores per step
    
    # Relationships
    pauses = relationship("TicketPause", back_populates="ticket")

    # AI Fields
    category_predicted = Column(String, nullable=True)

class TicketPause(Base):
    __tablename__ = "ticket_pauses"
    
    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String, ForeignKey("tickets.id"))
    reason = Column(String) # 'vendor', 'client'
    start_at = Column(DateTime(timezone=True), server_default=func.now())
    end_at = Column(DateTime(timezone=True), nullable=True)
    comments = Column(String, nullable=True)
    
    ticket = relationship("Ticket", back_populates="pauses")
    
class Contract(Base):
    __tablename__ = "contracts"
    
    id = Column(String, primary_key=True)
    client = Column(String, index=True)
    pep = Column(String, nullable=True) # made nullable to be safe
    folio = Column(String, nullable=True)
    description = Column(Text, nullable=True) # Changed to Text
    project_name = Column(String, nullable=True)
    service_type = Column(String, nullable=True) # made nullable
    status = Column(String, default="Preliminar")
    # country = Column(String, nullable=True) # User asked to REMOVE it from columns list but might still be in DB? I will make nullable.
    country = Column(String, nullable=True)
    sdm = Column(String, nullable=True)
    sales_rep = Column(String, nullable=True)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    
    # New Package & SLA fields
    service_package = Column(String, nullable=True)
    package_description = Column(Text, nullable=True) # Changed to Text
    schedule = Column(String, nullable=True)
    pm = Column(String, nullable=True)
    sla_type = Column(String, nullable=True)
    snow_contract = Column(String, nullable=True) # Contrato Snow
    
    # Legacy / not used but kept in logic just in case
    custom_attention_min = Column(Integer, nullable=True)
    custom_solution_hours = Column(Integer, nullable=True)
    
    # Relationships
    cis = relationship("ContractCI", back_populates="contract")

class ContractCI(Base):
    __tablename__ = "contract_cis"
    
    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(String, ForeignKey("contracts.id"))
    ci_name = Column(String) # Linking by name to CMDB for now

    contract = relationship("Contract", back_populates="cis")

class ConfigurationItem(Base):
    __tablename__ = "configuration_items"
    
    # Core Identity
    id = Column(String, primary_key=True) # Número de Configuration ITEM (Sistema)
    ci_number = Column(String, index=True, nullable=True) # Número de CI (Funcional)
    serial_number = Column(String, index=True) # Número Serial
    reference_number = Column(String, nullable=True) # Número referencia
    client = Column(String) # Cliente
    
    # Details
    description = Column(Text, nullable=True) # Descripción
    status = Column(String) # Estado
    
    # Dates
    start_date = Column(DateTime, nullable=True) # Inicio
    end_date = Column(DateTime, nullable=True) # Fin
    
    # Commercial
    po_number = Column(String, nullable=True) # Número de PO
    so_number = Column(String, nullable=True) # Número de SO
    
    # Cisco Specific
    cisco_support_end_date = Column(DateTime, nullable=True) # Fecha fin soporte Cisco
    cisco_support_start_date = Column(DateTime, nullable=True) # Fecha Inicio soporte Cisco
    cisco_contract_number = Column(String, nullable=True) # Contrato Cisco Número de contrato
    
    # Location
    city = Column(String, nullable=True) # Ciudad
    address = Column(String, nullable=True) # Dirección
    project_name = Column(String, nullable=True) # Nombre proyecto
    pep = Column(String, nullable=True) # PEP
    country = Column(String) # País
    
    # Technical
    type = Column(String) # Tipo (Server, Switch, etc.)
    device_model = Column(String, nullable=True) # Modelo Equipo
    contract_id = Column(String, nullable=True) # Número de Contrato
    snow_contract = Column(String, nullable=True) # Contrato Snow

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String)
    email = Column(String, unique=True, index=True)
    role = Column(String)  # Admin, Resolutor, Agent, Supervisor
    job_title = Column(String) # Ingeniero L1, L2, etc.
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class CatalogService(Base):
    __tablename__ = "catalog_services"

    id = Column(String, primary_key=True) # E.g. NET-SW. Acts as 'Codigo_Servicio_Sistema'
    category = Column(String, index=True) # E.g. Connectivity. 'Categoria'
    name = Column(String) # 'Servicio'
    
    # New Fields
    category_code = Column(String, nullable=True) # 'Codigo_Categoria_Sistema'
    category_description = Column(String, nullable=True) # 'Descripcion_Categoria'
    sief_code = Column(String, nullable=True) # 'Codigo_SIEF' (Service Level)
    service_description = Column(Text, nullable=True) # 'Descripcion_Servicio'
    
    icon = Column(String, nullable=True)
    
    scenarios = relationship("CatalogScenario", back_populates="service")

class CatalogScenario(Base):
    __tablename__ = "catalog_scenarios"
    
    id = Column(String, primary_key=True) # E.g. INC-SRV-SEC-FW-RULES. 'Codigo_Tipo_Sistema'
    name = Column(String) # E.g. Rules. 'Descripcion_Tipo'
    service_id = Column(String, ForeignKey("catalog_services.id"))
    
    type = Column(String) # 'incident' or 'request'. 'Tipo'
    
    # New Fields
    sief_code = Column(String, nullable=True) # 'Codigo_SIEF_Tipo'
    
    # Incident specific
    priority = Column(String, nullable=True)
    
    # Request specific
    complexity = Column(String, nullable=True)
    time = Column(String, nullable=True)
    
    # Common
    keywords = Column(Text, nullable=True)
    
    
    service = relationship("CatalogService", back_populates="scenarios")

class SLASetting(Base):
    __tablename__ = "sla_settings"
    id = Column(String, primary_key=True) # Low, Medium, High, Critical
    name = Column(String)
    attention_min = Column(Integer)
    solution_hours = Column(Integer)
    attention_display = Column(String)
    solution_display = Column(String)

class ServicePackageSetting(Base):
    __tablename__ = "service_package_settings"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    description = Column(Text, nullable=True)
