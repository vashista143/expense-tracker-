import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

const TransactionSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  category: String,
  type: { type: String, enum: ['income', 'expense'] },
  date: String,
  id: String 
});

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);

export default async function handler(req, res) {
  try {
    await connectDB();
    switch (req.method) {
      case 'GET':
        console.log("getting trans")
        const allTransactions = await Transaction.find().sort({ date: -1 });
        console.log(allTransactions)
        return res.status(200).json(allTransactions);
      case 'POST':
        const newTx = new Transaction(req.body);
        await newTx.save();
        return res.status(201).json(newTx);

      case 'PUT':
        const updated = await Transaction.findOneAndUpdate(
          { id: req.body.id }, 
          req.body, 
          { new: true }
        );
        return res.status(200).json(updated);
      case 'DELETE':
        const { id } = req.query;
        await Transaction.deleteOne({ id });
        return res.status(200).json({ message: 'Success' });
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server Error' });
  }
}