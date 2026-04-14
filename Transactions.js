import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { API } from '../api';

export default function Transactions(){
  const [data,setData]=useState([]);

  const load=async()=>{
    const res=await API.get('/expenses');
    setData(res.data);
  };

  const del=async(id)=>{
    await API.delete(`/expenses/${id}`);
    load();
  };

  useEffect(()=>{ load(); },[]);

  return (
    <div className='container'>
      <Sidebar/>
      <div className='main'>
        <h2>Transactions</h2>
        <table>
          <thead>
            <tr><th>Title</th><th>Category</th><th>Amount</th><th></th></tr>
          </thead>
          <tbody>
            {data.map(d=>(
              <tr key={d.id}>
                <td>{d.title}</td>
                <td>{d.category}</td>
                <td>{d.amount}</td>
                <td><button onClick={()=>del(d.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
