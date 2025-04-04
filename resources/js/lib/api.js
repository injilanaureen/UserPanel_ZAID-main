import axios from "axios";

export const  rechargeprocess = async (formData, token)=>{
    const response = await axios.post('/admin/recharge/process', {
        operator: parseInt(formData.operator),
        canumber: formData.canumber,
        amount: parseInt(formData.amount),
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      return response 
}