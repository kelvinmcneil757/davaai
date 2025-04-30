'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggeredContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const LabsPage = () => {
  const services = [
    {
      title: "Define the right KPIs",
      description: "Start with metrics that matter. We help you identify and track the key performance indicators that truly reflect your startup's growth potential."
    },
    {
      title: "Instrument your data layer",
      description: "Seamlessly integrate data collection across your CRMs, applications, and platforms to create a comprehensive view of your business performance."
    },
    {
      title: "Generate weekly summaries",
      description: "Receive AI-powered insights and actionable recommendations based on your data, helping you make informed decisions quickly."
    },
    {
      title: "Validate product-market fit",
      description: "Track and analyze user behavior patterns to quantify product-market fit and demonstrate clear traction to investors."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggeredContainerVariants}
            className="space-y-6"
          >
            <motion.h1 
              variants={fadeUpVariants}
              className="text-5xl md:text-6xl font-bold text-gray-900"
            >
              DAVA AI Labs
            </motion.h1>
            <motion.h2 
              variants={fadeUpVariants}
              className="text-2xl md:text-3xl text-gray-700 font-light"
            >
              MVP Validation-as-a-Service for Data-Driven Startups
            </motion.h2>
            <motion.p 
              variants={fadeUpVariants}
              className="text-xl text-gray-600"
            >
              We turn raw usage data into investor-ready traction stories.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
            className="text-3xl font-bold text-gray-900 mb-12 text-center"
          >
            What We Deliver
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggeredContainerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={fadeUpVariants}
                className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Ideal Client Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
            className="p-8 bg-gradient-to-r from-gray-50 to-white rounded-2xl shadow-lg border border-gray-100"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Perfect for…
            </h2>
            <p className="text-xl text-gray-700">
              Founders, accelerators, and fractional product leads who need to show real traction with real data.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggeredContainerVariants}
            className="space-y-8"
          >
            <motion.h2
              variants={fadeUpVariants}
              className="text-3xl md:text-4xl font-bold text-gray-900"
            >
              Get Started with DAVA AI Labs
            </motion.h2>
            <motion.p
              variants={fadeUpVariants}
              className="text-xl text-gray-600 mb-8"
            >
              Schedule a free discovery call or reach out to consulting@dava.ai to learn more.
            </motion.p>
            <motion.div
              variants={fadeUpVariants}
              className="flex flex-col md:flex-row gap-4 justify-center"
            >
              <Link
                href="#schedule"
                className="inline-flex items-center px-8 py-3 bg-[#00c851] text-white font-semibold rounded-lg hover:bg-[#00b548] transition-colors duration-300 group"
              >
                <span>Schedule Discovery Call</span>
                <motion.span
                  className="ml-2"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                >
                  →
                </motion.span>
              </Link>
              <Link
                href="mailto:consulting@dava.ai"
                className="inline-flex items-center px-8 py-3 border-2 border-[#00c851] text-[#00c851] font-semibold rounded-lg hover:bg-[#00c851] hover:text-white transition-colors duration-300 group"
              >
                <span>Email Us</span>
                <motion.span
                  className="ml-2"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LabsPage; 