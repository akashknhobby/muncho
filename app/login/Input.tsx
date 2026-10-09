export default function Input(props: any, x: any) {
  const pStyle = {
    color: '#1F2523',
    fontFamily: 'Inter, sans-serif',
    fontSize: '13px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: 'normal',
  };

  const istyle = { 
  display: 'flex', 
  padding: '12px', 
  justifyContent: 'center', 
  alignItems: 'flex-start', 
  gap: '8px', 
  alignSelf: 'stretch', 
  borderRadius: '8px', 
  border: '1px solid #000', 
  background: '#FFF' 
    };


  return (
    <>
      <p style={pStyle}>{props.txt}</p>
      <input type="text" placeholder={`Enter your ${props.txt}`} style={istyle} />
    </>
  );
}