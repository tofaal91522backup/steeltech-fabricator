import { Link } from "react-router-dom";
import SimpleChart from "../../components/SimpleChart";
import StatCard from "../../components/StatCard";
import { useViewDashboardQuery } from "../../features/reportsApi/reportsApi";
import { FiFileText } from "react-icons/fi";
import {
  MdOutlineCheck,
  MdOutlineManageAccounts,
  MdOutlinePeopleAlt,
  MdOutlinePeopleOutline,
} from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useGetAllFabricatorsQuery } from "../../features/fabricartorApi/fabricartorApi";
import { GoPeople } from "react-icons/go";
import { Pie } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  ArcElement,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";

import { Doughnut, Line, Bar } from "react-chartjs-2";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { adminLoggedOut } from "../../features/auth/adminAuthSlice";
ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const Dashboard = () => {
  const { data } = useViewDashboardQuery();
  const { data: fabricators, error } = useGetAllFabricatorsQuery({
    page: 1,
    view: "pending",
    searchTerm: "",
  });


  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(adminLoggedOut());
  };

  useEffect(() => {
    if (error?.status == 401) {
      handleLogout();
    }
  }, [error]);

  const barChartData = {
    labels: data?.sales_vs_fabricator_graph?.map(
      (item) => item?.fabricator__name
    ),
    datasets: [
      {
        label: "Sales (BDT)",
        data: data?.sales_vs_fabricator_graph?.map((item) => item?.total_sales),
        // backgroundColor: "#ED8C2F",
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "#f97316"); // orange-500
          gradient.addColorStop(1, "#ED8C2F"); // yellow-400
          return gradient;
        },
        borderRadius: 6, // Rounded corners
        barThickness: 40, // Optional: control width
        hoverBackgroundColor: "#f97316",
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Fabricator's Sales",
        font: {
          size: 18,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          stepSize: 200,
        },
        beginAtZero: true,
      },
    },
  };

  const pieData = {
    labels: ["Marketing Representative", "Distributor", "Approved"],
    datasets: [
      {
        label: "Total",
        data: [
          data?.marketing_representatives_count,
          data?.distributors_count,
          data?.approved_count,
        ],
        backgroundColor: ["#ff6384", "#ffcd56", "#36a2eb"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "",
      },
    },
  };

  const chartData = {
    labels: data?.sales_vs_date_graph?.map((item) => item?.sales_date),
    datasets: [
      {
        label: "Amount (BDT)",
        data: data?.sales_vs_date_graph?.map((item) => item?.total_sales),
        fill: true,
        backgroundColor: "rgba(255, 159, 64, 0.2)", // Area fill
        borderColor: "rgba(255, 159, 64, 1)", // Line color (orange)
        tension: 0.4, // smoothness of curve (0 for straight lines)
        pointRadius: 4,
        pointBackgroundColor: "rgba(255, 159, 64, 1)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Dates",
        },
      },
      y: {
        title: {
          display: true,
          text: "Amount (BDT)",
        },
        beginAtZero: true,
      },
    },
  };

  const quickActions = [
    {
      title: "Distributors",
      description: "Review all distributors",
      icon: <MdOutlinePeopleAlt />,
      link: "/distributors",
    },
    {
      title: "All Fabricators",
      description: "View all fabricators",
      icon: <GoPeople />,
      link: "/fabricator-management",
    },
    {
      title: "Marketing Reps",
      description: "Manage representatives",
      icon: <MdOutlineManageAccounts />,
      link: "/representative",
    },
  ];


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Applications"
          value={data?.applications_count}
          icon={<FiFileText className="text-black" />}
          color="blue"
        />
        <StatCard
          title="Approved"
          value={data?.approved_count}
          icon={<MdOutlineCheck className="text-black" />}
          color="green"
        />
        <StatCard
          title="Rejected"
          value={data?.rejected_count}
          icon={<RxCross2 className="text-black" />}
          color="red"
        />
        <StatCard
          title="Assigned"
          value={data?.assigned_count}
          icon={<MdOutlineManageAccounts className="text-black" />}
          color="orange"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="col-span-1 flex flex-col gap-3 justify-between ">
          <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col gap-12 py-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Marketing Rep
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {data?.marketing_representatives_count}
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center bg-purple-200`}
              >
                <span className="text-xl">
                  <MdOutlinePeopleOutline />
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Distributors</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {data?.distributors_count}
              </p>
            </div>
          </div>
        </div>
        <div className="md:col-span-3 flex flex-col lg:flex-row gap-4 bg-white shadow">
          <div className="h-full w-full">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
          {/* <div className="h-[300px]">
            <Pie data={pieData} options={options} />
          </div>
          <div className="w-full h-full mt-4">
            <Line data={chartData} options={chartOptions} />
          </div> */}
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6 ">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Applications
            </h3>
          </div>
          <div className="px-6 pb-6">
            <div className="space-y-4">
              {fabricators?.results?.map((record, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {record?.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {record?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {record?.phone_number}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {record?.sub_district}, {record?.district}
                    </p>
                    <p className="text-sm text-gray-600">
                      {record?.created_at?.slice(0, 10)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions and Pie Chart */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 ">
              <h3 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h3>
            </div>
            <div className="px-6 pb-6">
              <div className="space-y-4 flex flex-col gap-1">
                {quickActions.map((action, index) => (
                  <Link to={action?.link}>
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer border border-gray-200"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span>{action.icon}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {action.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
