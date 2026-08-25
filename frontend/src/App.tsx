function App() {
  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>🚧</div>

        <h1 style={styles.title}>Portal de Pedidos</h1>

        <p style={styles.subtitle}>
          Em construção
        </p>

        <div style={styles.line} />

        <p style={styles.description}>
          Estamos preparando o novo Portal de Pedidos.
        </p>

        <span style={styles.badge}>
          Grupo Akrus
        </span>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    margin: 0,
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0f172a',
    fontFamily: 'Arial, Helvetica, sans-serif',
    padding: '24px',
    boxSizing: 'border-box',
  },

  card: {
    width: '100%',
    maxWidth: '520px',
    textAlign: 'center',
    background: '#ffffff',
    borderRadius: '20px',
    padding: '48px 32px',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
  },

  icon: {
    fontSize: '48px',
    marginBottom: '20px',
  },

  title: {
    margin: 0,
    fontSize: '34px',
    color: '#0f172a',
    fontWeight: 700,
  },

  subtitle: {
    margin: '10px 0 0',
    fontSize: '22px',
    fontWeight: 600,
    color: '#f59e0b',
  },

  line: {
    width: '60px',
    height: '3px',
    background: '#f59e0b',
    margin: '28px auto',
    borderRadius: '10px',
  },

  description: {
    color: '#64748b',
    fontSize: '16px',
    lineHeight: 1.6,
    marginBottom: '28px',
  },

  badge: {
    display: 'inline-block',
    background: '#f1f5f9',
    color: '#334155',
    borderRadius: '999px',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: 600,
  },
};

export default App;