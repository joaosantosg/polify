import { Box, Card, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

const usuariosMockedData = [
  {
    id: 1,
    name: 'Juan',
    email: 'juan.silva@example.com',
    ativo: true,
    perfil: 'Administrador',
    data_criacao: '2024-11-20',
  },
  {
    id: 2,
    name: 'Maria',
    email: 'maria.oliveira@example.com',
    ativo: false,
    perfil: 'Usuário',
    data_criacao: '2024-10-15',
  },
  {
    id: 3,
    name: 'Carlos',
    email: 'carlos.santos@example.com',
    ativo: true,
    perfil: 'Moderador',
    data_criacao: '2024-08-12',
  },
  {
    id: 4,
    name: 'Ana',
    email: 'ana.souza@example.com',
    ativo: true,
    perfil: 'Usuário',
    data_criacao: '2024-09-01',
  },
  {
    id: 5,
    name: 'Pedro',
    email: 'pedro.almeida@example.com',
    ativo: false,
    perfil: 'Usuário',
    data_criacao: '2024-11-10',
  },

];



export default function Page() {
  return (
   <Box>
    <Card>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Ativo</TableCell>
            <TableCell>Perfil</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usuariosMockedData.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.ativo ? 'Sim' : 'Não'}</TableCell>
              <TableCell>{row.perfil}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
   </Box>
  )
}

