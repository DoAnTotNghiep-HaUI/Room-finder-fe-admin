"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiHome,
  FiPlus,
} from "react-icons/fi";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "sonner";
import clsx from "clsx";
import ContractView from "./contract-view";
import ContractForm from "./contract-form";
import { IRentalContract } from "@/types/contract";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "@/redux";
import {
  createContract,
  getListContractsByLandlord,
  updateContract,
} from "@/redux/contracts/action";
import ContractList from "./contracts-list";

type ContractStatus =
  | "all"
  | "active"
  | "expired"
  | "terminated"
  | "expiring_soon";

const RentalContractManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { contractsList } = useSelector((state: AppState) => state.contracts);
  const { userInfo } = useSelector((state: AppState) => state.auth);
  // Sample data
  const [contracts, setContracts] = useState<IRentalContract[]>(
    contractsList || []
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContractStatus>("all");
  const [selectedContract, setSelectedContract] =
    useState<IRentalContract | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getListContractsByLandlord(userInfo?.id));
  }, [userInfo]);
  useEffect(() => {
    setContracts(contractsList);
  }, [contractsList]);
  // CRUD operations
  const handleView = (contract: IRentalContract) => {
    setSelectedContract(contract);
    setIsViewModalOpen(true);
  };

  const handleEdit = (contract: IRentalContract) => {
    setSelectedContract(contract);
    setIsEditModalOpen(true);
  };

  const handleDelete = (contract: IRentalContract) => {
    setSelectedContract(contract);
    setIsDeleteModalOpen(true);
  };

  const handleRenew = (contract: IRentalContract) => {
    setSelectedContract(contract);
    setIsRenewModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedContract(null);
    setIsAddModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedContract) {
      // setContracts((prev) => prev.filter((c) => c.id !== selectedContract.id));
      toast.success("Đã xóa hợp đồng thành công");
      setIsDeleteModalOpen(false);
      setSelectedContract(null);
    }
  };

  const confirmRenew = async () => {
    if (selectedContract) {
      const newContract = {
        ...selectedContract,
        // id: Date.now().toString(),
        contract_number: `HD${String(contractsList.length + 1).padStart(
          3,
          "0"
        )}`,
        contract_start_date: selectedContract.contract_end_date,
        contract_end_date: new Date(
          new Date(selectedContract.contract_end_date).setFullYear(
            new Date(selectedContract.contract_end_date).getFullYear() + 1
          )
        )
          .toISOString()
          .split("T")[0],
        status: "active",
        room: selectedContract.room.id,
        tenant: selectedContract.tenant.id,
        landlord: selectedContract.landlord.id,
        contract_file: selectedContract.contract_file.id,
      };
      await delete newContract.id;
      await dispatch(createContract(newContract));
      await dispatch(
        updateContract({
          contractId: selectedContract.id,
          data: { status: "terminated" },
        })
      );
      await dispatch(getListContractsByLandlord(userInfo?.id));

      // Update old contract status to terminated
      // setContracts((prev) =>
      //   prev.map((c) =>
      //     c.id === selectedContract.id
      //       ? { ...c, status: "terminated" as const }
      //       : c
      //   )
      // );

      // // Add new contract
      // setContracts((prev) => [...prev, newContract]);

      toast.success("Đã gia hạn hợp đồng thành công");
      setIsRenewModalOpen(false);
      setSelectedContract(null);
    }
  };

  const onSubmit = (data) => {
    if (selectedContract) {
      // setContracts((prev) =>
      //   prev.map((c) =>
      //     c.id === selectedContract.id
      //       ? {
      //           ...data,
      //           id: selectedContract.id,
      //           updated_at: new Date().toISOString().split("T")[0],
      //         }
      //       : c
      //   )
      // );
      console.log("data", data);
    } else {
      //   const newContract = {
      //     ...data,
      //     id: Date.now().toString(),
      //     contract_number:
      //       data.contract_number ||
      //       `HD${String(contracts.length + 1).padStart(3, "0")}`,
      //     created_at: new Date().toISOString().split("T")[0],
      //     updated_at: new Date().toISOString().split("T")[0],
      //   };
      //   setContracts((prev) => [...prev, newContract]);
      //   console.log("data", data);
    }
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setSelectedContract(null);
  };

  // Filtered contracts
  const filteredContracts = useMemo(() => {
    return contractsList.filter((contract) => {
      const matchesSearch =
        contract.tenant
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        contract.contract_number
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        contract.landlord
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "expiring_soon" &&
          isExpiringSoon(contract.contract_end_date)) ||
        (statusFilter !== "expiring_soon" && contract.status === statusFilter);

      return matchesSearch && matchesStatus;
    });
  }, [contractsList, searchTerm, statusFilter]);

  const isExpiringSoon = (endDate: string) => {
    const today = new Date();
    const contractEnd = new Date(endDate);
    const diffTime = contractEnd.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  return (
    <div className="p-6 min-h-screen">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Quản lý hợp đồng thuê nhà
          </h1>
          <p className="text-muted-foreground">
            Quản lý thông tin hợp đồng thuê nhà và người thuê
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên người thuê, số hợp đồng, chủ nhà..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-input"
              />
            </div>
            <div className="flex items-center gap-2">
              <FiFilter className="text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as ContractStatus)
                }
                className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-input"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Còn hạn</option>
                <option value="expired">Hết hạn</option>
                <option value="terminated">Đã chấm dứt</option>
                <option value="expiring_soon">Sắp hết hạn (30 ngày)</option>
              </select>
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-4 py-2 bg-[#1E88E5] text-white rounded-lg hover:bg-[#1976D2] transition-colors"
              >
                <FiPlus size={16} />
                Thêm hợp đồng
              </button>
            </div>
          </div>
        </div>

        {/* Contracts Table */}
        <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Số HĐ
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Người thuê
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Chủ nhà
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Toà nhà
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Phòng
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Tiền thuê
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Ngày hết hạn
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <AnimatePresence>
                  {filteredContracts.map((contract, index) => (
                    <motion.tr
                      key={contract.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {contract.contract_number}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            {contract.tenant?.first_name}{" "}
                            {contract.tenant?.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {contract.tenant_phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-foreground">
                          {contract?.landlord?.first_name}{" "}
                          {contract?.landlord?.last_name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-foreground">
                          {contract?.room?.building?.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-foreground">
                          {contract?.room?.number_room}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(contract.monthly_rental)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-foreground">
                          {new Date(
                            contract.contract_end_date
                          ).toLocaleDateString("vi-VN")}
                        </div>
                        {isExpiringSoon(contract.contract_end_date) && (
                          <div className="text-xs text-red-600 font-medium">
                            Sắp hết hạn!
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {(() => {
                          const statusConfig = {
                            active: {
                              label: "Còn hạn",
                              className: "bg-green-100 text-green-800",
                            },
                            expired: {
                              label: "Hết hạn",
                              className: "bg-red-100 text-red-800",
                            },
                            terminated: {
                              label: "Đã chấm dứt",
                              className: "bg-gray-100 text-gray-800",
                            },
                          };

                          const config =
                            statusConfig[
                              contract.status as keyof typeof statusConfig
                            ];
                          return (
                            <span
                              className={clsx(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                config.className
                              )}
                            >
                              {config.label}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleView(contract)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <FiEye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(contract)}
                            className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          {contract.status === "expired" && (
                            <button
                              onClick={() => handleRenew(contract)}
                              className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                              title="Gia hạn"
                            >
                              <FiRefreshCw size={16} />
                            </button>
                          )}
                          {/* <button
                            onClick={() => handleDelete(contract)}
                            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <FiTrash2 size={16} />
                          </button> */}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {filteredContracts.length === 0 && (
            <div className="text-center py-12">
              <FiHome className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Không tìm thấy hợp đồng
              </h3>
              <p className="text-muted-foreground">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
              </p>
            </div>
          )}
        </div>

        {/* View Modal */}
        <ContractView
          contract={selectedContract}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
        />

        {/* Edit Modal */}
        <ContractForm
          contract={selectedContract}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={onSubmit}
          mode="edit"
        />

        {/* Add Modal */}
        <ContractForm
          contract={null}
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={onSubmit}
          mode="add"
        />

        {/* Delete Confirmation Modal */}
        <Transition
          appear
          show={isDeleteModalOpen}
          as={React.Fragment}
        >
          <Dialog
            as="div"
            className="relative z-50"
            onClose={() => setIsDeleteModalOpen(false)}
          >
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={React.Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-foreground mb-4"
                    >
                      Xác nhận xóa hợp đồng
                    </Dialog.Title>
                    <div className="mb-6">
                      <p className="text-sm text-muted-foreground">
                        Bạn có chắc chắn muốn xóa hợp đồng{" "}
                        <strong>{selectedContract?.contract_number}</strong> của
                        người thuê{" "}
                        <strong>
                          {selectedContract?.tenant.first_name}{" "}
                          {selectedContract?.tenant.last_name}
                        </strong>
                        ?
                      </p>
                      <p className="text-sm text-destructive mt-2">
                        Hành động này không thể hoàn tác.
                      </p>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                        onClick={() => setIsDeleteModalOpen(false)}
                      >
                        Hủy
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-destructive-foreground bg-destructive hover:bg-destructive/90 rounded-lg transition-colors"
                        onClick={confirmDelete}
                      >
                        Xóa hợp đồng
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        {/* Renew Confirmation Modal */}
        <Transition
          appear
          show={isRenewModalOpen}
          as={React.Fragment}
        >
          <Dialog
            as="div"
            className="relative z-50"
            onClose={() => setIsRenewModalOpen(false)}
          >
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={React.Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-foreground mb-4"
                    >
                      Xác nhận gia hạn hợp đồng
                    </Dialog.Title>
                    <div className="mb-6">
                      <p className="text-sm text-muted-foreground">
                        Bạn có muốn gia hạn hợp đồng{" "}
                        <strong>{selectedContract?.contract_number}</strong> của
                        người thuê{" "}
                        <strong>
                          {selectedContract?.tenant.first_name}{" "}
                          {selectedContract?.tenant.last_name}
                        </strong>
                        ?
                      </p>
                      <p className="text-sm text-primary mt-2">
                        Hệ thống sẽ tạo một hợp đồng mới với thông tin tương tự
                        và thời hạn 12 tháng.
                      </p>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                        onClick={() => setIsRenewModalOpen(false)}
                      >
                        Hủy
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                        onClick={confirmRenew}
                      >
                        Gia hạn hợp đồng
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
};

export default RentalContractManagement;
