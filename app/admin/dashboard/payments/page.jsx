"use client"
import { useState, useEffect } from 'react';
import { db } from '@/firebase/firebase';
import { collection, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore';
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Link,
  Stack,
  Collapse,
} from '@mui/material';

const PaymentPageAdmin = () => {
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    paymentTitle: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentPrice: '',
    coupon:'',
    couponPercentage: "",
  });
  const [payments, setPayments] = useState([]);

  
  // Fetch payments from Firestore
  const getAllPaymentsData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'payments'));
      const paymentsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPayments(paymentsList);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  useEffect(() => {
    getAllPaymentsData();
  }, []);

  // Generate a unique custom ID: BA-Sept-XXXXX-{timestamp}
const generateCustomId = (name) => {
  const prefix = 'BA-Sept-';
  
  // Remove special characters and spaces, keep only letters and numbers
  let sanitized = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 5);

  // Ensure it's exactly 5 characters by padding with "X"
  while (sanitized.length < 5) {
    sanitized += 'X';
  }

  const timestamp = Date.now(); // Unique timestamp in milliseconds
  return `${prefix}${sanitized}-${timestamp}`;
};


  // Add new payment
  const addNewPayment = async () => {
    try {
      const customId = generateCustomId(formData.name);
      const dataToSave = { ...formData, id: customId };
      await setDoc(doc(db, 'payments', customId), dataToSave);
      setPayments([...payments, dataToSave]);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        paymentTitle: '',
        city: '',
        postalCode: '',
        paymentPrice: '',
        coupon:"",
        couponPercentage: "",
      });
      setOpenForm(false); // close the form after submission
    } catch (error) {
      console.error('Error adding payment:', error);
    }
  };

  // Delete payment by id
  const deletePayment = async (id) => {
    try {
      await deleteDoc(doc(db, 'payments', id));
      setPayments(payments.filter((payment) => payment.id !== id));
    } catch (error) {
      console.error('Error deleting payment:', error);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Payments
      </Typography>
      
      {/* Button to toggle form */}
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        onClick={() => setOpenForm(!openForm)}
      >
        {openForm ? 'Close Form' : 'New Payment'}
      </Button>
      
      {/* Collapse form */}
      <Collapse in={openForm}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Stack spacing={2}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <TextField
              label="Phone"
              variant="outlined"
              fullWidth
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            <TextField
              label="Address"
              variant="outlined"
              fullWidth
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
            <TextField
              label="City"
              variant="outlined"
              fullWidth
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
            />
            <TextField
              label="Payment Title"
              variant="outlined"
              fullWidth
              value={formData.paymentTitle}
              onChange={(e) =>
                setFormData({ ...formData, paymentTitle: e.target.value })
              }
            />
      <TextField
              label="Coupon"
              variant="outlined"
              fullWidth
              value={formData.coupon}
              onChange={(e) =>
                setFormData({ ...formData, coupon: e.target.value })
              }
            />
               <TextField
              label="Coupon Percentage"
              variant="outlined"
              fullWidth
              placeholder='write 10% as 10'
              type="number"
              value={formData.couponPercentage}
              onChange={(e) =>
                setFormData({ ...formData, couponPercentage: e.target.value })
              }
            />
            <TextField
              label="Payment Price"
              variant="outlined"
              fullWidth
              type="number"
              value={formData.paymentPrice}
              onChange={(e) =>
                setFormData({ ...formData, paymentPrice: e.target.value })
              }
            />
            <Button variant="contained" color="primary" onClick={addNewPayment}>
              Add Payment
            </Button>
          </Stack>
        </Paper>
      </Collapse>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Coupon</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.name}</TableCell>
                <TableCell>{payment.email}</TableCell>
                <TableCell>{payment.phone}</TableCell>
                <TableCell>₹{payment.paymentPrice}</TableCell>
                <TableCell>
                  {payment.paid ? (
                    <span className="bg-green-500 px-2 py-1 rounded text-white">
                      Paid
                    </span>
                  ) : (
                    <span className="bg-red-500 px-2 py-1 rounded text-white">
                      Pending
                    </span>
                  )}
                </TableCell>
                <TableCell>{payment.coupon} {payment.couponPercentage}%</TableCell>

                <TableCell align="center">
                  <Stack spacing={1}>
                    <Link
                      href={`https://www.boardingadmissions.com/boardingadmissionspayments/${payment.id}`}
                      target="_blank"
                      underline="hover"
                    >
                      Payment Link
                    </Link>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => deletePayment(payment.id)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default PaymentPageAdmin;
