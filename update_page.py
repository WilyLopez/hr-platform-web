import re

file_path = r"C:\Users\ENTERCORE\Documents\RR_HH\hr-platform-web\src\app\(admin)\admin\asistencia\page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Imports
content = content.replace(
    'import { Card, CardBody, Button, Spinner, Badge } from "@/components/ui";',
    'import { Card, CardBody, Button, Spinner, Badge, Tabs, TabList, TabTrigger, TabContent, Modal, Input } from "@/components/ui";'
)

# 2. Add extras state and functions
state_addition = """
  const [extras, setExtras] = useState<RegistroAsistencia[]>([]);
  const [loadingExtras, setLoadingExtras] = useState(false);
  const [evaluatingExtra, setEvaluatingExtra] = useState<RegistroAsistencia | null>(null);
  const [minutosAprobados, setMinutosAprobados] = useState(0);
  const [comentarioAprobacion, setComentarioAprobacion] = useState("");

  const cargarExtras = async () => {
    setLoadingExtras(true);
    try {
      const data = await asistenciaService.listar({ fecha: filtroFecha, solo_extras: true } as any);
      setExtras(data);
    } catch (error) {
      toast.error("Error al cargar las horas extras.");
    } finally {
      setLoadingExtras(false);
    }
  };
"""

content = content.replace(
    "  const cargarAsistencia = async () => {",
    state_addition + "\n  const cargarAsistencia = async () => {"
)

# 3. Update useEffect
content = content.replace(
    "cargarAsistencia();\n  }, [filtroFecha]);",
    "cargarAsistencia();\n    cargarExtras();\n  }, [filtroFecha]);"
)

# 4. Add evaluation logic
eval_logic = """
  const handleAprobarExtras = async (aprobar: boolean) => {
    if (!evaluatingExtra) return;
    try {
      await asistenciaService.aprobarExtras(
        evaluatingExtra.id,
        aprobar ? minutosAprobados : 0,
        comentarioAprobacion,
        aprobar
      );
      toast.success(aprobar ? "Horas extras aprobadas." : "Horas extras rechazadas.");
      setEvaluatingExtra(null);
      cargarExtras();
      cargarAsistencia(); // refresh monitor too
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Error al evaluar horas extras.");
    }
  };

  const getEstadoExtrasColor = (estado: string | null) => {
    switch(estado) {
      case "APROBADA": return "success";
      case "RECHAZADA": return "danger";
      case "PENDIENTE": return "warning";
      default: return "neutral";
    }
  };
"""

content = content.replace(
    "  const getEstadoColor = (estado: string) => {",
    eval_logic + "\n  const getEstadoColor = (estado: string) => {"
)

# 5. Wrap monitor in Tabs
# Look for: <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
tab_start = """
      <Tabs defaultValue="monitor">
        <TabList className="mb-4">
          <TabTrigger value="monitor" icon={Clock}>Monitor de Asistencia</TabTrigger>
          <TabTrigger value="extras" icon={CheckCircle2}>Horas Extras</TabTrigger>
        </TabList>
        <TabContent value="monitor">
"""
content = content.replace(
    '<div className="grid grid-cols-1 md:grid-cols-4 gap-4">',
    tab_start + '\n      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">'
)

# 6. End monitor tab and add extras tab
tab_end_and_extras = """
        </TabContent>

        <TabContent value="extras">
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-sm">
                    <th className="p-4 font-semibold text-slate-700">Empleado</th>
                    <th className="p-4 font-semibold text-slate-700">Fecha/Hora</th>
                    <th className="p-4 font-semibold text-slate-700">Generadas (min)</th>
                    <th className="p-4 font-semibold text-slate-700">Aprobadas (min)</th>
                    <th className="p-4 font-semibold text-slate-700">Estado</th>
                    <th className="p-4 font-semibold text-slate-700 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingExtras ? (
                    <tr>
                      <td colSpan={6} className="p-10 text-center">
                        <Spinner size="md" className="mx-auto" />
                      </td>
                    </tr>
                  ) : extras.length > 0 ? (
                    extras.map((registro: any) => (
                      <tr key={registro.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-medium text-slate-800">{registro.empleado_nombre}</td>
                        <td className="p-4 text-slate-600 font-mono text-sm">{new Date(registro.timestamp).toLocaleString()}</td>
                        <td className="p-4 text-slate-600 font-bold">{registro.minutos_extra} min</td>
                        <td className="p-4 text-slate-600 font-medium">
                          {registro.minutos_extra_aprobados !== null ? `${registro.minutos_extra_aprobados} min` : '-'}
                        </td>
                        <td className="p-4">
                          <Badge variant={getEstadoExtrasColor(registro.estado_extras)}>
                            {registro.estado_extras || "PENDIENTE"}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          {registro.estado_extras === 'PENDIENTE' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => {
                                setEvaluatingExtra(registro);
                                setMinutosAprobados(registro.minutos_extra);
                                setComentarioAprobacion("");
                              }}
                            >
                              Evaluar
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-10 text-center text-slate-500">
                        No hay horas extras registradas en esta fecha.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabContent>
      </Tabs>

      <Modal 
        open={!!evaluatingExtra} 
        onClose={() => setEvaluatingExtra(null)}
        title="Evaluar Horas Extras"
      >
        {evaluatingExtra && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Empleado: <strong>{evaluatingExtra.empleado_nombre}</strong><br />
              Horas extras generadas: <strong>{evaluatingExtra.minutos_extra} min</strong>
            </p>
            <div>
              <label className="block text-sm font-medium mb-1">Minutos a aprobar (máximo {evaluatingExtra.minutos_extra}):</label>
              <Input
                type="number"
                min={0}
                max={evaluatingExtra.minutos_extra}
                value={minutosAprobados}
                onChange={(e: any) => setMinutosAprobados(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Comentario:</label>
              <Input
                type="text"
                placeholder="Opcional..."
                value={comentarioAprobacion}
                onChange={(e: any) => setComentarioAprobacion(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => handleAprobarExtras(false)}>
                Rechazar Todo
              </Button>
              <Button variant="brand" onClick={() => handleAprobarExtras(true)}>
                Aprobar
              </Button>
            </div>
          </div>
        )}
      </Modal>
"""

content = content.replace(
    '      </Card>\n    </div>',
    '      </Card>\n' + tab_end_and_extras + '\n    </div>'
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated successfully")
