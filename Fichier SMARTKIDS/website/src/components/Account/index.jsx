import React, { useEffect, useMemo, useState } from 'react';
import { Pencil, Check, X, Trash } from 'lucide-react';
import useToggle from '../../Hooks/useToggle.js';
import Drawer from '../Mobile/Drawer.jsx';
import HeaderHomeTwo from '../HomeTwo/HeaderHomeTwo.jsx';
import FooterHomeTwo from '../HomeTwo/FooterHomeTwo.jsx';
import discovery from '../../assets/images/discovery.png';
import pro from '../../assets/images/pro.png';
import premium from '../../assets/images/premium.png';
import BackToTop from '../BackToTop.jsx';
import {
  useLazyGetProfileQuery,
  useLazyGetSubscriptionStatusQuery,
  useListPlansQuery,
  useUpdateProfileMutation,
  useGetMyEtablissementQuery,
  useEditEtablissementMutation,
  useDeleteEtablissementImageMutation
} from '../../features/user/userApiSlice';

function Account() {
  const [drawer, drawerAction] = useToggle(false);
  const [getProfile, { data, isLoading, error }] = useLazyGetProfileQuery();
  const [getSubscriptionStatus, { data: subscriptionData }] = useLazyGetSubscriptionStatusQuery();
  const { data: plansData } = useListPlansQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const { data: etabData, refetch: refetchEtablissement } = useGetMyEtablissementQuery();
  const [editEtablissement] = useEditEtablissementMutation();
  const [remainingImages, setRemainingImages] = useState([]);



  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingField, setEditingField] = useState(null);
  const [fieldValue, setFieldValue] = useState('');
  const [newImages, setNewImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getProfile();
    getSubscriptionStatus();
  }, []);

  const user = data?.data;
  const subscription = subscriptionData?.data?.subscription;
  const plans = plansData?.data;
  const etablissement = etabData?.data || null;

  useEffect(() => {
    if (user?.name) setNewName(user.name);
  }, [user]);

  const userPlan = useMemo(() => {
    if (!plans || !subscription?.subscriptionPlanId) return null;
    return plans.find(plan => plan.id === subscription.subscriptionPlanId);
  }, [plans, subscription]);

  const canEdit = userPlan?.id !== '68230fd9a0ce2fa707ca72fe';

  const startEditingField = (field, currentValue) => {
    setEditingField(field);
    setFieldValue(currentValue || '');
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImagesCount = (etablissement?.images?.length || 0) + files.length;
    if (totalImagesCount > 5) {
      alert("Vous ne pouvez pas avoir plus de 5 images au total.");
      return;
    }
    setNewImages(files);
  };

  const uploadImages = async () => {
    if (!etablissement || newImages.length === 0) return;
  
    try {
      setUploading(true);
      const formData = new FormData();
  
      // ✅ Extraire uniquement l’ID de la catégorie
      const categoryId = etablissement.category?.id ?? etablissement.category?._id ?? '';
  
      const fields = [
        'nom', 'description', 'code_promo', 'phone', 'adresse',
        'longitude', 'latitude', 'min_age', 'max_age'
      ];
  
      fields.forEach(key => {
        const value = etablissement[key];
        formData.append(key, value != null ? value.toString() : '');
      });
  
      // ✅ Ajouter la catégorie séparément
      formData.append('category', categoryId);
  
      // Ajout des autres champs complexes
      etablissement.options?.forEach(option => {
        if (option?.id) formData.append('options', option.id);
      });
  
      etablissement.dailyOpeningHours?.forEach(doh => {
        formData.append('dailyOpeningHours', JSON.stringify(doh));
      });
  
      etablissement.services?.forEach(service => {
        formData.append('services', JSON.stringify(service));
      });
  
      // Images
      newImages.forEach(file => formData.append('images', file));
  
      // Appel API
      await editEtablissement(formData).unwrap();
      await refetchEtablissement();
      setNewImages([]);
      alert('Images ajoutées avec succès !');
    } catch (err) {
      console.error('Erreur lors de l\'upload des images :', err);
      alert('Erreur lors de l\'upload des images.');
    } finally {
      setUploading(false);
    }
  };

  const [deleteEtablissementImage] = useDeleteEtablissementImageMutation();

  const updateRemainingImages = async (imagesToKeep) => {
    if (!etablissement) return;
  
    try {
      setUploading(true);
  
      // 🗑️ Supprimer les images qui ne sont plus présentes
      const imagesToDelete = etablissement.images.filter(
        (img) => !imagesToKeep.includes(img.src)
      );
  
      for (const image of imagesToDelete) {
        try {
          await deleteEtablissementImage({
            etablissementId: etablissement.id,
            mediaId: image._id || image.id, // ajuster selon ton schéma
          }).unwrap();
        } catch (err) {
          console.error("Erreur suppression image :", image.src, err);
        }
      }
  
      // 📦 Envoi du reste des données
      const formData = new FormData();
      const categoryId = etablissement.category?.id ?? etablissement.category?._id ?? '';
      const fields = ['nom', 'description', 'code_promo', 'phone', 'adresse', 'longitude', 'latitude', 'min_age', 'max_age'];
  
      fields.forEach(key => {
        const value = etablissement[key];
        formData.append(key, value != null ? value.toString() : '');
      });
  
      formData.append('category', categoryId);
  
      etablissement.options?.forEach(option => {
        if (option?.id) formData.append('options', option.id);
      });
      etablissement.dailyOpeningHours?.forEach(doh => {
        formData.append('dailyOpeningHours', JSON.stringify(doh));
      });
      etablissement.services?.forEach(service => {
        formData.append('services', JSON.stringify(service));
      });
  
      imagesToKeep.forEach(url => {
        formData.append('existingImages', url);
      });
  
      newImages.forEach(file => {
        formData.append('images', file);
      });
  
      await editEtablissement(formData).unwrap();
      await refetchEtablissement();
      alert('Images mises à jour avec succès !');
    } catch (err) {
      console.error('Erreur lors de la mise à jour des images :', err);
      alert('Erreur lors de la mise à jour des images.');
    } finally {
      setUploading(false);
    }
  };
  
  
  
  useEffect(() => {
    if (etablissement?.images) {
      setRemainingImages(etablissement.images.map(i => i.src)); // attention ici, on veut les URLs
    }
  }, [etablissement]);
  
  

  const saveField = async () => {
    if (!etablissement) return;
  
    const categoryId = etablissement.category?.id ?? etablissement.category?._id ?? '';
  
    try {
      const formData = new FormData();
      const updateKeys = [
        'nom',
        'description',
        'code_promo',
        'phone',
        'adresse',
        'longitude',
        'latitude',
        'category',
        'min_age',
        'max_age',
        'website',
      ];
  
      updateKeys.forEach(key => {
        let value;
        if (key === 'category') {
          value = categoryId;
        } else {
          value = editingField === key ? fieldValue : etablissement[key];
        }
        formData.append(key, value != null ? value.toString() : '');
      });
  
      etablissement.options?.forEach(option => {
        if (option?.id) formData.append('options', option.id);
      });
  
      etablissement.dailyOpeningHours?.forEach(doh => {
        formData.append('dailyOpeningHours', JSON.stringify(doh));
      });
  
      etablissement.services?.forEach(service => {
        formData.append('services', JSON.stringify(service));
      });
  
      if (['facebook', 'instagram', 'tiktok', 'linkedin'].includes(editingField)) {
        console.log('🔗 Réseau social modifié :', editingField, '=>', fieldValue);
        formData.append(editingField, fieldValue || '');
      }
  
      await editEtablissement(formData).unwrap();
      await refetchEtablissement();
      setEditingField(null);
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l’établissement :', err);
      if (err?.data?.errors) console.table(err.data.errors);
    }
  };
  
  
  const scrollCarousel = (direction) => {
    const container = document.querySelector('.carousel-track');
    if (!container) return;
  
    const slideWidth = container.offsetWidth;
    container.scrollBy({
      left: direction === 'next' ? slideWidth : -slideWidth,
      behavior: 'smooth',
    });
  };  

  const cancelEditField = () => {
    setEditingField(null);
    setFieldValue('');
  };

  useEffect(() => {
    if (etablissement?.images) {
      setRemainingImages(etablissement.images.map(i => i.src));
    }
  }, [etablissement]);
  

  return (
    <>
      <Drawer drawer={drawer} action={drawerAction.toggle} />
      <HeaderHomeTwo action={drawerAction.toggle} />

      <main className="container account-section mt-5 mb-5">
        <h2 className="text-2xl font-bold mb-4">Mon compte</h2>

        {isLoading && <p>Chargement...</p>}
        {error && <p>Erreur lors du chargement du profil.</p>}

        {user ? (
          <div className="max-w-lg mx-auto">
            <p className="flex items-center gap-2">
              <strong>Nom :</strong>
              {canEdit ? (
                editingName ? (
                  <>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="border rounded px-2 py-1"
                    />
                    <button
                      onClick={async () => {
                        try {
                          await updateProfile({ name: newName, email: user.email }).unwrap();
                          getProfile();
                          setEditingName(false);
                        } catch (err) {
                          console.error("Erreur mise à jour nom :", err);
                        }
                      }}
                    >
                      <Check className="w-4 h-4 text-green-600" />
                    </button>
                    <button onClick={() => {
                      setNewName(user.name);
                      setEditingName(false);
                    }}>
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  </>
                ) : (
                  <>
                    <span>{user.name}</span>
                    <button onClick={() => setEditingName(true)}>
                      <Pencil className="w-4 h-4 text-blue-600" />
                    </button>
                  </>
                )
              ) : (
                <span className="ml-2">{user.name}</span>
              )}
            </p>

            <p><strong>Email :</strong> {user.email}</p>
            <p><strong>Créé le :</strong> {new Date(user.createdAt).toLocaleString()}</p>

            {subscription && userPlan && (
              <div className="plan-container">
              <img
                src={
                  userPlan?.id === '68230fd9a0ce2fa707ca72fe'
                    ? discovery
                    : userPlan?.id === '68230fd9a0ce2fa707ca72ff' || userPlan?.id === '68230fd9a0ce2fa707ca7300'
                    ? pro
                    : userPlan?.id === '68230fd9a0ce2fa707ca7301' || userPlan?.id === '68230fd9a0ce2fa707ca7302'
                    ? premium
                    : ''
                }
                alt="Image plan"
                className="plan-image"
              />
            
              <div className="plan-details">
                <p><strong>Abonnement :</strong> {userPlan.name}</p>
                <p><strong>Prix :</strong> {userPlan.price} € / {userPlan.interval_unit}</p>
                <p><strong>Souscrit le :</strong> {new Date(subscription.createdAt).toLocaleString()}</p>
              </div>
            </div>
            
            )}

            <div className="mt-6 border-t pt-4">
                    <h3 className="text-lg font-semibold mb-2">Mon établissement</h3>

                    {etablissement ? (
                      <div className="space-y-2">
                        {/* Images affichage */}
                        {etablissement.images && etablissement.images.length > 0 && (
                          <div className="carousel-wrapper">
                            {/* Flèches à l'extérieur du container */}
                            {etablissement.images.length > 1 && (
                              <>
                                <button
                                  className="carousel-button prev"
                                  onClick={() => scrollCarousel('prev')}
                                >
                                  ‹
                                </button>
                                <button
                                  className="carousel-button next"
                                  onClick={() => scrollCarousel('next')}
                                >
                                  ›
                                </button>
                              </>
                            )}

                            <div className="carousel-container">
                              <div className="carousel-track">
                                {(userPlan?.id === '68230fd9a0ce2fa707ca72fe'
                                  ? etablissement.images.slice(0, 1)
                                  : etablissement.images.slice(0, 5)
                                ).map((img, index) => (
                                  <div key={index} className="carousel-slide relative">
                                    <img
                                      src={img.src}
                                      alt={`Image ${index + 1}`}
                                      className="carousel-image"
                                    />

                                    {canEdit && (
                                      <button
                                      onClick={() => {
                                        const updated = remainingImages.filter(url => url !== img.src);
                                        setRemainingImages(updated);
                                        updateRemainingImages(updated); // on lui passe les images restantes
                                      }}
                                      className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-red-100"
                                      title="Supprimer cette image"
                                    >
                                      <Trash className="w-4 h-4 text-red-600" />
                                    </button>                                                                      
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}



                        {/* Upload images uniquement si canEdit (hors forfait 68230fd9a0ce2fa707ca72fe) */}
                        {canEdit ? (
                          <div className="upload-wrapper">
                          <label htmlFor="image-upload" className="upload-label">
                            Ajouter des images (max 5 au total)
                          </label>
                        
                          <label htmlFor="image-upload" className="custom-upload-button">
                            Choisir des images
                          </label>
                          <input
                            type="file"
                            id="image-upload"
                            multiple
                            accept="image/*"
                            onChange={handleImagesChange}
                            disabled={uploading}
                            className="hidden-upload-input"
                          />
                        
                          {newImages.length > 0 && (
                            <button
                              className="upload-button"
                              onClick={uploadImages}
                              disabled={uploading}
                            >
                              {uploading ? 'Upload en cours...' : 'Uploader les images'}
                            </button>
                          )}
                        </div>                        
                        ) : (
                          <div className="pro-upgrade-message">
                            <p className="pro-text">
                              <strong>Plus de photos ?</strong> Passez à la version Pro maintenant pour ajouter jusqu’à 5 images.
                            </p>
                            <a href="/abonnement" className="pro-button">Découvrir les avantages</a>
                          </div>
                        )}



                        {/* Champs modifiables établissement (nom, adresse, phone, description) */}
                        {['nom', 'adresse', 'description', 'phone'].map((field) => {
                          const isPhoneField = field === 'phone';
                          const canEditField = canEdit;

                          const isDisabled = isPhoneField
                            ? !canEdit // phone est désactivé si pas Pro
                            : !canEditField; // autres champs désactivés si ni Pro ni auteur

                          const isVisible = !isPhoneField || canEdit; // phone est visible uniquement si Pro

                          return (
                            <div key={field} className={`form-group ${isDisabled ? 'disabled-field' : ''}`}>
                              <strong>{field.charAt(0).toUpperCase() + field.slice(1)} :</strong>{' '}

                              {editingField === field ? (
                                <>
                                  <input
                                    className="input-field"
                                    value={fieldValue}
                                    onChange={(e) => setFieldValue(e.target.value)}
                                    disabled={isDisabled}
                                  />
                                  <div className="action-buttons">
                                    <button onClick={saveField} disabled={isDisabled}>
                                      <Check className="icon icon-green" />
                                    </button>
                                    <button onClick={cancelEditField} disabled={isDisabled}>
                                      <X className="icon icon-red" />
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <div className="display-field">
                                  {!isVisible ? (
                                    <>
                                      <span className="not-visible">Non visible</span>
                                      <div className="tooltip-container">
                                        <span className="tooltip-icon">?</span>
                                        <div className="tooltip-text">
                                          Le numéro de téléphone est masqué pour les établissements sans abonnement Pro.
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <span>{etablissement[field]}</span>
                                      {!isDisabled && (
                                        <button onClick={() => startEditingField(field, etablissement[field])}>
                                          <Pencil className="icon icon-blue" />
                                        </button>
                                      )}
                                    </>
                                  )}
                                </div>
                              )}

                              {isPhoneField && !canEdit && (
                                <p className="warning-highlight">
                                  Passez au forfait supérieur pour activer cette option.
                                </p>
                              )}
                            </div>
                          );
                        })}
                        <div>
                          <strong>Catégorie :</strong> {etablissement.category?.titre}
                        </div>
                      </div>
                    ) : (
                      <p>Aucun établissement trouvé.</p>
                    )}
                  </div>
                  {/* Champs réservés aux forfaits non limités */}
                  {canEdit && (
                    <div className="mt-4 space-y-4">
                      {/* Lien cliquable */}
                      <div>
                        <strong>Lien cliquable :</strong>{' '}
                        {editingField === 'website' ? (
                          <>
                            <input
                              className="border px-2 py-1 rounded w-full"
                              value={fieldValue}
                              onChange={(e) => setFieldValue(e.target.value)}
                            />
                            <button onClick={saveField}>
                              <Check className="w-4 h-4 text-green-600" />
                            </button>
                            <button onClick={cancelEditField}>
                              <X className="w-4 h-4 text-red-600" />
                            </button>
                          </>
                        ) : (
                          <>
                            <a
                              href={etablissement.website || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              {etablissement.website || 'Aucun lien renseigné'}
                            </a>
                            <button className="ml-2" onClick={() => startEditingField('website', etablissement.website)}>
                              <Pencil className="w-4 h-4 text-blue-600" />
                            </button>
                          </>
                        )}
                      </div>

                      {/* Réseaux sociaux */}
                      {['facebook', 'instagram', 'tiktok', 'linkedin'].map((network) => (
                        <div key={network}>
                          <strong>{network.charAt(0).toUpperCase() + network.slice(1)} :</strong>{' '}
                          {editingField === network ? (
                            <>
                              <input
                                value={fieldValue}
                                onChange={(e) => setFieldValue(e.target.value)}
                              />
                              <button onClick={saveField}><Check /></button>
                              <button onClick={cancelEditField}><X /></button>
                            </>
                          ) : (
                            <>
                              <span>{etablissement[network]}</span>
                              {canEdit && (
                                <button onClick={() => startEditingField(network, etablissement[network])}>
                                  <Pencil />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      ))}

                    </div>
                  )}
          </div>
        ) : (
          <p>Aucun utilisateur connecté.</p>
        )}
      </main>

      <FooterHomeTwo />
      <BackToTop className="back-to-top" />
    </>
  );
}

export default Account;
