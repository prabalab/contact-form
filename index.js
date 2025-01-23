<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React Contact Form</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.20.7/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
<script type="text/babel">
  function ContactForm() {
    const [formData, setFormData] = React.useState({
      name: '',
      email: '',
      message: ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch('/api/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (response.ok) {
          alert('Thank you for contacting us!');
          setFormData({ name: '', email: '', message: '' }); // Reset form
        } else {
          alert('Failed to send your message. Please try again later.');
        }
      } catch (err) {
        console.error(err);
        alert('Error connecting to the server.');
      }
    };

    return (
      <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
        <h2>Contact Us</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px', margin: '5px 0' }}
              />
            </label>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px', margin: '5px 0' }}
              />
            </label>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>
              Message:
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px', margin: '5px 0' }}
              ></textarea>
            </label>
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: '#007BFF',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '5px'
            }}
          >
            Submit
          </button>
        </form>
      </div>
    );
  }

  ReactDOM.createRoot(document.getElementById('root')).render(<ContactForm />);
</script>
  
</body>
</html>
