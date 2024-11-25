interface UnderConstructionProps {
  mode: string
}

const UnderConstruction: React.FC<UnderConstructionProps> = ({ mode }) => {
  const messageStyle: React.CSSProperties = {
    textAlign: 'center',
    marginTop: '50px',
    color: mode === 'dark' ? '#fff' : '#333',
  }

  return (
    <div style={messageStyle}>
      <h1>🚧 Página em Construção 🚧</h1>
      <p>Estamos trabalhando para trazer essa página o mais rápido possível!</p>
    </div>
  )
}

export default UnderConstruction
