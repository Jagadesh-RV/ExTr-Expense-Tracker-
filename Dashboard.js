import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { API } from '../api';
import { Doughnut } from 'react-chartjs-2';
export default function Dashboard(){
  const [cats,setCats]=useState([]);
  const [exps,setExps]=useState([]);
  const [form,setForm]=useState({title:'',amount:'',category_id:''});

  const load=async()=>{
    const c=await API.get('/categories');
    const e=await API.get('/expenses');
    setCats(c.data);
    setExps(e.data);
  };
useEffect(()=>{ load(); },[]);

  const addCat=async(name)=>{
    if(!name) return;
    await API.post('/categories',{name});
    load();
  };

  const addExp=async()=>{
    const {title,amount,category_id}=form;
    if(!title||!amount||!category_id) return;
    await API.post('/expenses',form);
    setForm({title:'',amount:'',category_id:''});
    load();
  };

  const total=exps.reduce((s,e)=>s+Number(e.amount),0);

  const grouped={};
  exps.forEach(e=>{
    grouped[e.category]=(grouped[e.category]||0)+Number(e.amount);
  });
   const chartData={labels:Object.keys(grouped),datasets:[{data:Object.values(grouped)}]};

  return (
    <div className='container'>
      <Sidebar/>
      <div className='main'>
        <h2>Total: {total}</h2>

        <input placeholder='New Category' onKeyDown={e=>{
          if(e.key==='Enter') addCat(e.target.value)
        }}/>

        <h3>Add Expense</h3>
        <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder='Title'/>
        <input value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} placeholder='Amount'/>

        <select value={form.category_id} onChange={e=>setForm({...form,category_id:e.target.value})}>
          <option value=''>Select</option>
          {cats.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <button onClick={addExp}>Add</button>

        <Doughnut data={chartData}/>
      </div>
    </div>
  );
}