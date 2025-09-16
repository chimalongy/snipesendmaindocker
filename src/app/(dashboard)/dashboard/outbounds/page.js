"use client";

import {
  RiMailSendLine,
  RiAddLine,
  RiDeleteBinLine,
  RiEyeLine,
  RiCalendarLine,
  RiMore2Fill,
  RiSearchLine,
  RiFilterLine,
} from "react-icons/ri";
import Link from "next/link";
import { useState, useEffect } from "react";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import axios from "axios";
import { apiSumary } from "@/app/utils/apiSummary";
import useUserStore from "@/app/utils/store/user";
import useSelectedOutboundStore from "@/app/utils/store/selectedoutbound";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";

export default function OutboundManagement() {
 let  router = useRouter();
  const user = useUserStore((state) => state.user);
  const setSelectedOutbound = useSelectedOutboundStore((state) => state.setSelectedOutbound);
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    campaignId: null,
    campaignName: ""
  });
  const [expandedEmails, setExpandedEmails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState({
    startDate: null,
    endDate: null,
    showAll: true
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDelete = async (id) => {
    try {
      let response = await axios.post(apiSumary.delete_outbound, {outbound_id: id});
      let result = response.data;
      if (!result.success){
        throw new Error({message: result?.message});
      }
      
      toast.success("Outbound deleted");
      setCampaigns(campaigns.filter((campaign) => campaign.outbound_id !== id));
      setDeleteConfirm({ isOpen: false, campaignId: null, campaignName: "" });
    } catch (error) {
      console.log("Failed to delete campaign:", error?.message);
      toast.error(error.message);
    }
  };

  async function getUserOutbounds() {
    setIsLoading(true);
    try {
      let result = await axios.post(apiSumary.get_user_outbounds, {
        userId: user.id,
      });

      if (result.data.success) {
        let campaigns = [];
        let useroutbounds = result.data.data;

        for (let i = 0; i < useroutbounds.length; i++) {
          let outbound_name = useroutbounds[i].outbound_name;
          let list_allocations = JSON.parse(useroutbounds[i].list_allocations);
          let created_at = new Date(useroutbounds[i].created_at);
          let formattedDate = created_at.toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
          
          let receiverscount = 0;
          for (let i = 0; i < list_allocations.length; i++) {
            receiverscount += list_allocations[i].list.length;
          }
          
          campaigns.push({
            outbound_id: useroutbounds[i].id,
            deleted_email_list: useroutbounds[i].deleted_email_list,
            recipients_count: receiverscount,
            outbound_name,
            list_allocations,
            created_at: formattedDate,
            rawDate: created_at
          });
        }
        setCampaigns(campaigns);
        setFilteredCampaigns(campaigns);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (user?.id) getUserOutbounds();
  }, [user?.id]);

  useEffect(() => {
    filterCampaigns();
  }, [searchTerm, dateFilter, campaigns]);

  const filterCampaigns = () => {
    let results = [...campaigns];
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(campaign =>
        campaign.outbound_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply date filter
    if (!dateFilter.showAll && dateFilter.startDate && dateFilter.endDate) {
      results = results.filter(campaign => {
        const campaignDate = new Date(campaign.rawDate);
        return campaignDate >= dateFilter.startDate && campaignDate <= dateFilter.endDate;
      });
    }

    setFilteredCampaigns(results);
  };

  const toggleEmailExpansion = (id) => {
    setExpandedEmails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const openDeleteModal = (index) => {
    const campaign = filteredCampaigns[index];
    setDeleteConfirm({
      isOpen: true,
      campaignId: campaign.outbound_id,
      campaignName: campaign.outbound_name
    });
  };

  const resetDateFilter = () => {
    setDateFilter({
      startDate: null,
      endDate: null,
      showAll: true
    });
  };

  return (
    <div className="space-y-6 pb-[60px] ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Outbound Email Campaigns
          </h2>
          <p className="text-sm text-gray-500">
            Manage your email sending campaigns
          </p>
        </div>
        <Link
          href="/dashboard/outbounds/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap"
        >
          <RiAddLine className="mr-2" />
          New Campaign
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <RiSearchLine className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Date Filter */}
        <div className="relative">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full md:w-auto"
          >
            <RiFilterLine className="mr-2 h-4 w-4" />
            {dateFilter.showAll ? "Filter by date" : 
              `${dateFilter.startDate?.toLocaleDateString()} - ${dateFilter.endDate?.toLocaleDateString()}`}
          </button>

          {showDatePicker && (
            <div className="absolute z-10 mt-2 bg-white p-4 rounded-md shadow-lg border border-gray-200">
              <div className="flex flex-col space-y-4">
                <div className="flex space-x-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <DatePicker
                      selected={dateFilter.startDate}
                      onChange={(date) => setDateFilter(prev => ({
                        ...prev,
                        startDate: date,
                        showAll: false
                      }))}
                      selectsStart
                      startDate={dateFilter.startDate}
                      endDate={dateFilter.endDate}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <DatePicker
                      selected={dateFilter.endDate}
                      onChange={(date) => setDateFilter(prev => ({
                        ...prev,
                        endDate: date,
                        showAll: false
                      }))}
                      selectsEnd
                      startDate={dateFilter.startDate}
                      endDate={dateFilter.endDate}
                      minDate={dateFilter.startDate}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      setDateFilter(prev => ({ ...prev, showAll: true }));
                      setShowDatePicker(false);
                    }}
                    className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-900"
                  >
                    Show All
                  </button>
                  <div>
                    <button
                      onClick={() => setShowDatePicker(false)}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setShowDatePicker(false)}
                      className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
        {/* Total Campaigns */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-3 py-4 sm:p-6 flex items-center">
            <div className="flex-shrink-0 bg-indigo-100 p-2 sm:p-3 rounded-md">
              <RiMailSendLine className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
            </div>
            <div className="ml-3 sm:ml-5">
              <div className="text-xs sm:text-sm text-gray-500">Total Campaigns</div>
              <div className="text-lg sm:text-2xl font-semibold text-gray-900">
                {isLoading ? "..." : filteredCampaigns.length}
              </div>
            </div>
          </div>
        </div>

        {/* Scheduled Tasks */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-3 py-4 sm:p-6 flex items-center">
            <div className="flex-shrink-0 bg-purple-100 p-2 sm:p-3 rounded-md">
              <RiCalendarLine className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <div className="ml-3 sm:ml-5">
              <div className="text-xs sm:text-sm text-gray-500">Scheduled Tasks</div>
              <div className="text-lg sm:text-2xl font-semibold text-gray-900">
                0
              </div>
            </div>
          </div>
        </div>

        {/* All Tasks */}
        <div className="bg-white overflow-hidden shadow rounded-lg col-span-2 md:col-span-1">
          <div className="px-3 py-4 sm:p-6 flex items-center">
            <div className="flex-shrink-0 bg-blue-100 p-2 sm:p-3 rounded-md">
              <RiMailSendLine className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="ml-3 sm:ml-5">
              <div className="text-xs sm:text-sm text-gray-500">All Tasks</div>
              <div className="text-lg sm:text-2xl font-semibold text-gray-900">
                0
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Your Campaigns</h3>
          {!dateFilter.showAll && (
            <button
              onClick={resetDateFilter}
              className="text-xs text-indigo-600 hover:text-indigo-900 flex items-center"
            >
              Clear date filter
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">Loading campaigns...</div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              {searchTerm || !dateFilter.showAll 
                ? "No campaigns match your search/filter criteria" 
                : "No campaigns found. Create your first campaign to get started."}
            </div>
          ) : (
            <div className="min-w-full">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campaign Name
                    </th>
                    <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      From Addresses
                    </th>
                    <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipients
                    </th>
                    <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-4 py-3 sm:px-6 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCampaigns.map((campaign, index) => (
                    <tr key={campaign.outbound_id}>
                      <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {campaign.outbound_name}
                        </div>
                      </td>
                      <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm text-gray-500">
                            {campaign.list_allocations[0]?.emailAssigned || 'N/A'}
                            {campaign.list_allocations.length > 1 && (
                              <span className="text-gray-400 ml-1">
                                +{campaign.list_allocations.length - 1}
                              </span>
                            )}
                          </div>
                          {campaign.list_allocations.length > 1 && (
                            <button
                              onClick={() => toggleEmailExpansion(index)}
                              className="ml-2 text-gray-400 hover:text-gray-600"
                              aria-label="Show more emails"
                            >
                              <RiMore2Fill className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        {expandedEmails[index] && (
                          <div className="mt-2 space-y-1">
                            {campaign.list_allocations
                              .slice(1)
                              .map((allocation, idx) => (
                                <div key={idx} className="text-xs text-gray-500">
                                  {allocation.emailAssigned}
                                </div>
                              ))}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-sm text-gray-500">
                        {campaign.recipients_count.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-sm text-gray-500">
                        {campaign.created_at}
                      </td>
                      <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <p
                          
                          className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                          title="View"
                          onClick={() => {
                            setSelectedOutbound(campaign)
                            router.push(`/dashboard/outbounds/${campaign.outbound_name}`)
                            
                          }}
                        >
                          <RiEyeLine className="w-4 h-4" />
                        </p>
                        <Link
                          href={`/dashboard/outbounds/${campaign.outbound_name}/newtask`}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                          title="Schedule"
                          onClick={() => setSelectedOutbound(campaign)}
                        >
                          <RiCalendarLine className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => openDeleteModal(index)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center"
                          title="Delete"
                          aria-label={`Delete campaign ${campaign.outbound_name}`}
                        >
                          <RiDeleteBinLine className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteConfirm.isOpen}
        onCancel={() => setDeleteConfirm({ isOpen: false, campaignId: null, campaignName: "" })}
        onConfirm={() => handleDelete(deleteConfirm.campaignId)}
        itemName={deleteConfirm.campaignName}
        title="Delete Campaign"
        message={`Are you sure you want to delete the campaign "${deleteConfirm.campaignName}"? This action cannot be undone.`}
      />
    </div>
  );
}