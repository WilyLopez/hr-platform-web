export interface Turno {
  id?: number;
  horario_id?: number;
  dia_semana: number; // 0=Lunes, 6=Domingo
  hora_inicio: string | null;
  hora_fin: string | null;
  minutos_refrigerio: number;
  es_laborable: boolean;
}

export interface Horario {
  id: number;
  nombre: string;
  descripcion: string | null;
  es_activo: boolean;
  tolerancia_ingreso_min: number;
  tolerancia_salida_min: number;
  horas_extras_permitidas: boolean;
  max_horas_extras_dia: number;
  turnos: Turno[];
  empleados_asignados?: number | null;
}

export interface HorarioCreateInput {
  nombre: string;
  descripcion?: string | null;
  tolerancia_ingreso_min: number;
  tolerancia_salida_min: number;
  horas_extras_permitidas: boolean;
  max_horas_extras_dia: number;
  turnos: Omit<Turno, 'id' | 'horario_id'>[];
}

export interface HorarioUpdateInput extends HorarioCreateInput {
  es_activo: boolean;
}

export interface AsignacionHorario {
  id: number;
  empleado_id: number;
  horario_id: number;
  horario_nombre: string;
  fecha_desde: string;
  fecha_hasta: string | null;
  fecha_creacion: string;
}

export interface AsignacionHorarioInput {
  empleado_id: number;
  horario_id: number;
  fecha_desde: string;
  fecha_hasta?: string | null;
}
